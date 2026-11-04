import mongoose from "mongoose";
import { AppError } from "../errors/app-error";
import { BrowserSessionModel } from "../models/browser-session.model";
import { PersonModel } from "../models/person.model";
import { SiteModel } from "../models/site.model";
import { VisitModel } from "../models/visit.model";
import { normalizeAddress } from "../utils/address";
import { adjacentIndex, pushEntry, updateEntryScroll } from "../utils/navigation-stack";

type NavigationType = "typed" | "link" | "search" | "history";
const personQueues = new Map<string, Promise<void>>();

async function forPerson<T>(personId: string, operation: () => Promise<T>): Promise<T> {
  const previous = personQueues.get(personId) || Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => { release = resolve; });
  personQueues.set(personId, current);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (personQueues.get(personId) === current) personQueues.delete(personId);
  }
}

async function requirePerson(personId: string): Promise<void> {
  if (!await PersonModel.exists({ _id: personId })) {
    throw new AppError(404, "Person not found.", "PERSON_NOT_FOUND");
  }
}

function sessionResponse(session: {
  entries: Array<{ address: string; scrollY: number; visitId?: mongoose.Types.ObjectId | null }>;
  currentIndex: number;
}) {
  return {
    entries: session.entries.map((entry) => ({
      address: entry.address,
      scrollY: entry.scrollY,
      visitId: entry.visitId?.toString() || null
    })),
    currentIndex: session.currentIndex,
    canGoBack: session.currentIndex > 0,
    canGoForward: session.currentIndex >= 0 && session.currentIndex < session.entries.length - 1
  };
}

export const navigationService = {
  async get(personId: string) {
    await requirePerson(personId);
    const session = await BrowserSessionModel.findOneAndUpdate(
      { personId },
      { $setOnInsert: { entries: [], currentIndex: -1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    if (!session) throw new AppError(500, "Browser session could not be loaded.", "SESSION_UNAVAILABLE");
    return sessionResponse(session);
  },

  async navigate(personId: string, addressInput: string, navigationType: NavigationType) {
    return forPerson(personId, async () => {
      await requirePerson(personId);
      const address = normalizeAddress(addressInput);
      const site = await SiteModel.findOne({ address }).select("_id address").lean();
      if (!site) throw new AppError(404, `No website exists at ${address}.`, "SITE_NOT_FOUND");

      let session = await BrowserSessionModel.findOne({ personId });
      if (!session) session = await BrowserSessionModel.create({ personId, entries: [], currentIndex: -1 });
      const sequence = await VisitModel.countDocuments({ personId }) + 1;
      const visit = await VisitModel.create({
        personId,
        siteId: site._id,
        address,
        visitedAt: new Date(),
        navigationType,
        sequence
      });
      const nextEntries = pushEntry(session.entries, session.currentIndex, { address, scrollY: 0, visitId: visit._id });
      session.entries.splice(0, session.entries.length, ...nextEntries);
      session.currentIndex = session.entries.length - 1;
      session.updatedAt = new Date();
      try {
        await session.save();
      } catch (error) {
        await VisitModel.deleteOne({ _id: visit._id });
        throw error;
      }
      return {
        site: await SiteModel.findById(site._id).populate("authorId", "name").lean(),
        navigation: sessionResponse(session)
      };
    });
  },

  async move(personId: string, direction: "back" | "forward") {
    return forPerson(personId, async () => {
      await requirePerson(personId);
      const session = await BrowserSessionModel.findOne({ personId });
      if (!session || session.entries.length === 0) throw new AppError(409, "There is no page to navigate to.", "NAVIGATION_EMPTY");
      const nextIndex = adjacentIndex(session.currentIndex, session.entries.length, direction);
      if (nextIndex === -1) {
        throw new AppError(409, `Cannot go ${direction === "back" ? "back" : "forward"} from this page.`, "NAVIGATION_BOUNDARY");
      }
      session.currentIndex = nextIndex;
      session.updatedAt = new Date();
      await session.save();
      const entry = session.entries[nextIndex];
      const site = await SiteModel.findOne({ address: entry.address }).populate("authorId", "name").lean();
      if (!site) throw new AppError(404, `No website exists at ${entry.address}.`, "SITE_NOT_FOUND");
      return { site, scrollY: entry.scrollY, navigation: sessionResponse(session) };
    });
  },

  async restore(personId: string, entryId: string, scrollY: number) {
    return forPerson(personId, async () => {
      await requirePerson(personId);
      const session = await BrowserSessionModel.findOne({ personId });
      if (!session) throw new AppError(409, "There is no page position to restore.", "NAVIGATION_EMPTY");
      if (!updateEntryScroll(session.entries, entryId, scrollY)) {
        throw new AppError(409, "That page is no longer in the navigation path.", "NAVIGATION_ENTRY_MISSING");
      }
      session.updatedAt = new Date();
      await session.save();
      return sessionResponse(session);
    });
  }
};
