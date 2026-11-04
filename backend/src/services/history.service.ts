import { AppError } from "../errors/app-error";
import { PersonModel } from "../models/person.model";
import { VisitModel } from "../models/visit.model";

export const historyService = {
  async list(personId: string) {
    if (!await PersonModel.exists({ _id: personId })) {
      throw new AppError(404, "Person not found.", "PERSON_NOT_FOUND");
    }
    return VisitModel.find({ personId })
      .sort({ visitedAt: 1, sequence: 1 })
      .limit(500)
      .populate("siteId", "title")
      .lean();
  }
};
