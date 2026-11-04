import { PersonModel } from "../models/person.model";

export const personService = {
  list() {
    return PersonModel.find().sort({ name: 1 }).select("_id name type").lean();
  }
};
