import "dotenv/config";
import { createHash } from "node:crypto";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { BrowserSessionModel } from "../models/browser-session.model";
import { PersonModel } from "../models/person.model";
import { SiteModel } from "../models/site.model";
import { VisitModel } from "../models/visit.model";
import { extractSearchableText, sanitizePublishedHtml } from "../security/html-sanitizer";

const seedDate = new Date("2025-03-01T10:00:00.000Z");
const personRows = [
  { key: "person-ada", name: "Ada North", type: "both" as const },
  { key: "person-milo", name: "Milo Reed", type: "both" as const },
  { key: "person-jo", name: "Jo Rivera", type: "reader" as const },
  { key: "person-erin", name: "Erin Bell", type: "publisher" as const },
  { key: "person-sam", name: "Sam Okafor", type: "reader" as const }
];
const people = new Map(personRows.map((person) => [person.key, stableId(person.key)]));

function stableId(key: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(createHash("sha1").update(key).digest("hex").slice(0, 24));
}

const siteRows = [
  ["tidepool.zz", "The Tidepool Ledger", "person-ada", `<main><h1>The Tidepool Ledger</h1><p>At the edge of the bay, the tidepool keeps a small and changing record of the world. Each returning tide leaves salt, shells, and a new arrangement of stones.</p><p>Marine naturalist Lena writes that patience reveals more than a net ever could. Look closely at the anemones, and then read the <a href="mountain.zz">mountain field notes</a>.</p><p>On quiet mornings the water mirrors the sky. See also <a href="oldmaps.zz">the old maps archive</a> and a lost page at <a href="moonharbor.zz">moonharbor.zz</a>.</p></main>`],
  ["mountain.zz", "A Mountain Field Guide", "person-milo", `<main><h1>A Mountain Field Guide</h1><p>Granite holds the day's warmth long after sunset. This field guide follows a footpath above the tree line, where wind-shaped pines grow low and patient.</p><p>Cartographer Eli Voss marks the spring melt beside a trail to the <a href="greenhouse.zz">community greenhouse</a>. A good map is an invitation to notice where water travels.</p><p>For coastal weather compare the <a href="tidepool.zz">tidepool ledger</a>. An older route ends at the unavailable <a href="highpass.zz">highpass.zz</a>.</p></main>`],
  ["greenhouse.zz", "The Winter Greenhouse", "person-ada", `<main><h1>The Winter Greenhouse</h1><p>Even in February, the greenhouse smells of damp earth and citrus leaves. Volunteers trade seeds, label jars, and keep a notebook of what survives the coldest week.</p><p>Gardener June Park recommends turning compost slowly and leaving one corner wild. Her notes continue in the <a href="bookcorner.zz">book corner</a> and the <a href="forestnotes.zz">forest notebook</a>.</p><p>The broken directory entry <a href="seedcatalog.zz">seedcatalog.zz</a> has not been planted.</p></main>`],
  ["bookcorner.zz", "The Book Corner", "person-erin", `<main><h1>The Book Corner</h1><p>A bookshop can be a public square with a roof. Readers leave pencilled recommendations in a blue notebook near the window, alongside short reviews and borrowed recipes.</p><p>This month the reading group explores journeys and night skies. Start with the <a href="spacejournal.zz">space journal</a> or visit <a href="citystories.zz">stories from the city</a>.</p><p>Bookseller Noor keeps a shelf for unreturned books; the catalogue still points to <a href="quietisland.zz">quietisland.zz</a>.</p></main>`],
  ["spacejournal.zz", "The Pocket Space Journal", "person-milo", `<main><h1>The Pocket Space Journal</h1><p>On clear nights, a patient observer can trace the slow drift of Jupiter against the stars. This pocket journal collects observations made from a small rooftop observatory.</p><p>Engineer Tomas Imani describes a homemade mount built from reclaimed wood. The next entry follows the <a href="stargazer.zz">stargazer's guide</a>, then descends to <a href="techtoday.zz">practical technology notes</a>.</p><p>A proposed station at <a href="kepler-yard.zz">kepler-yard.zz</a> remains only a rumour.</p></main>`],
  ["forestnotes.zz", "Forest Notes", "person-jo", `<main><h1>Forest Notes</h1><p>After rain, the forest floor is a map of footprints and fallen leaves. Field ecologist Ren keeps notes on moss, birdsong, and the places where old trees shelter new growth.</p><p>One marked path leads to <a href="mountain.zz">the mountain guide</a>; another reaches the <a href="greenhouse.zz">winter greenhouse</a>. Both habitats are connected by water and careful observation.</p><p>The northern boardwalk to <a href="cedarstation.zz">cedarstation.zz</a> is closed this season.</p></main>`],
  ["citystories.zz", "Small City Stories", "person-erin", `<main><h1>Small City Stories</h1><p>On one short block, a tailor has repaired coats for forty years and a bakery opens before the first bus. These stories collect small acts of care that make a city feel familiar.</p><p>Reporter Mae Lin follows the old tram route through three neighbourhoods. Her walking map borrows a corner from <a href="oldmaps.zz">the old maps room</a> and a poem from <a href="bookcorner.zz">the book corner</a>.</p><p>The final stop, <a href="tramline-9.zz">tramline-9.zz</a>, was removed before the route was finished.</p></main>`],
  ["techtoday.zz", "Tools for a Thoughtful Web", "person-sam", `<main><h1>Tools for a Thoughtful Web</h1><p>Useful technology is often quiet: a tool that keeps a list, a page that loads quickly, or a clear explanation that helps someone make a choice.</p><p>Editor Amara Nwosu writes about accessible interfaces, careful defaults, and small software that respects its readers. Explore the <a href="spacejournal.zz">space journal</a> and the <a href="tidepool.zz">coastal ledger</a>.</p><p>Our planned tools index at <a href="toolbox.zz">toolbox.zz</a> is not online yet.</p></main>`],
  ["oldmaps.zz", "The Old Maps Room", "person-ada", `<main><h1>The Old Maps Room</h1><p>Maps tell two stories: the places they describe and the choices made by the person who drew them. This archive gathers route sketches, marginal notes, and changing street names.</p><p>Archivist Sol Bell compares a hand-drawn harbour with today's shoreline in the <a href="tidepool.zz">tidepool ledger</a>. A pencilled road climbs toward <a href="mountain.zz">the mountain field guide</a>.</p><p>A map fragment labelled <a href="northquay.zz">northquay.zz</a> has lost its matching page.</p></main>`],
  ["stargazer.zz", "A Stargazer's Almanac", "person-milo", `<main><h1>A Stargazer's Almanac</h1><p>This almanac helps new observers find bright planets and meteor showers without expensive equipment. A dark patch of sky and a little time are enough to begin.</p><p>Keep a paper log, learn the names of a few constellations, and share discoveries in the <a href="spacejournal.zz">pocket space journal</a>. For a practical telescope mount, read <a href="techtoday.zz">Tools for a Thoughtful Web</a>.</p><p>The winter event calendar links to <a href="winter-comet.zz">winter-comet.zz</a>, a page that was never published.</p></main>`]
] as const;

async function seed(): Promise<void> {
  await connectDatabase();
  const personIds = new Map<string, mongoose.Types.ObjectId>();
  for (const person of personRows) {
    const _id = people.get(person.key)!;
    await PersonModel.updateOne(
      { _id },
      { $set: { name: person.name, type: person.type }, $setOnInsert: { createdAt: seedDate } },
      { upsert: true }
    );
    personIds.set(person.key, _id);
  }

  const siteIds = new Map<string, mongoose.Types.ObjectId>();
  for (const [address, title, authorKey, rawHtml] of siteRows) {
    const _id = stableId(`site:${address}`);
    const htmlContent = sanitizePublishedHtml(rawHtml);
    await SiteModel.updateOne(
      { address },
      {
        $set: {
          title,
          htmlContent,
          searchableText: extractSearchableText(htmlContent),
          authorId: personIds.get(authorKey),
          updatedAt: seedDate
        },
        $setOnInsert: { _id, createdAt: seedDate }
      },
      { upsert: true }
    );
    siteIds.set(address, _id);
  }

  const trails: Array<{ person: string; addresses: string[]; minutes: number[] }> = [
    { person: "person-ada", addresses: ["tidepool.zz", "mountain.zz", "greenhouse.zz", "bookcorner.zz", "spacejournal.zz", "tidepool.zz", "oldmaps.zz", "citystories.zz", "forestnotes.zz", "stargazer.zz", "techtoday.zz", "mountain.zz"], minutes: [0, 5, 10, 15, 20, 24, 29, 34, 39, 44, 49, 59] },
    { person: "person-milo", addresses: ["spacejournal.zz", "stargazer.zz", "techtoday.zz", "mountain.zz", "tidepool.zz", "spacejournal.zz"], minutes: [2, 12, 21, 31, 42, 57] },
    { person: "person-jo", addresses: ["forestnotes.zz", "greenhouse.zz", "mountain.zz", "oldmaps.zz"], minutes: [7, 23, 38, 55] },
    { person: "person-sam", addresses: ["techtoday.zz", "bookcorner.zz", "citystories.zz"], minutes: [13, 33, 53] }
  ];

  for (const trail of trails) {
    const personId = personIds.get(trail.person)!;
    for (let index = 0; index < trail.addresses.length; index += 1) {
      const address = trail.addresses[index];
      const visitedAt = new Date(seedDate.getTime() - (60 - trail.minutes[index]) * 60_000);
      const _id = stableId(`visit:${trail.person}:${index}`);
      await VisitModel.updateOne(
        { _id },
        {
          $set: {
            personId,
            siteId: siteIds.get(address),
            address,
            visitedAt,
            navigationType: index === 0 ? "typed" : "link",
            sequence: index + 1
          }
        },
        { upsert: true }
      );
    }
    const addresses = trail.addresses;
    await BrowserSessionModel.updateOne(
      { personId },
      {
        $set: {
          entries: addresses.slice(-4).map((address, entryIndex) => {
            const visitIndex = addresses.length - Math.min(addresses.length, 4) + entryIndex;
            return { address, scrollY: 0, visitId: stableId(`visit:${trail.person}:${visitIndex}`) };
          }),
          currentIndex: Math.min(addresses.length, 4) - 1,
          revision: addresses.length,
          updatedAt: seedDate
        }
      },
      { upsert: true }
    );
  }

  console.log(`Seeded ${siteRows.length} websites, ${personRows.length} people, and ${trails.reduce((total, trail) => total + trail.addresses.length, 0)} visits.`);
}

seed()
  .catch((error: unknown) => {
    console.error("Seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => mongoose.disconnect());
