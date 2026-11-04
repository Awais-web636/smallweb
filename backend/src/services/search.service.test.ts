jest.mock("../models/site.model", () => ({ SiteModel: { find: jest.fn() } }));

import { SiteModel } from "../models/site.model";
import { searchService } from "./search.service";

const mockFind = jest.mocked(SiteModel.find);

describe("searchService", () => {
  beforeEach(() => {
    mockFind.mockReset();
  });

  it("searches titles and page text without mixing a text search into an $or", async () => {
    const site = {
      address: "tidepool.zz",
      title: "The Tidepool Ledger",
      searchableText: "Moonlight settles over the water."
    };
    const query = {
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([site])
    };
    mockFind.mockReturnValue(query as never);

    await expect(searchService.search("moonlight")).resolves.toEqual([{
      address: "tidepool.zz",
      title: "The Tidepool Ledger",
      snippet: "Moonlight settles over the water."
    }]);

    expect(mockFind).toHaveBeenCalledWith({
      $or: [
        { searchableText: /moonlight/i },
        { title: /moonlight/i }
      ]
    });
    expect(query.select).toHaveBeenCalledWith("address title searchableText");
    expect(query.limit).toHaveBeenCalledWith(50);
  });

  it("rejects an empty search term before querying sites", async () => {
    await expect(searchService.search("  ")).rejects.toMatchObject({
      statusCode: 400,
      code: "EMPTY_QUERY"
    });
    expect(mockFind).not.toHaveBeenCalled();
  });
});
