import request from "supertest";
import { app } from "./app";

describe("API shell", () => {
  it("exposes a health check", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("validates requests before reaching database services", async () => {
    const response = await request(app).post("/api/sites").send({});
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns a consistent error for unknown routes", async () => {
    const response = await request(app).get("/api/not-a-route");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("rejects oversized JSON bodies with an explicit client error", async () => {
    const response = await request(app)
      .post("/api/sites")
      .send({ content: "x".repeat(225 * 1024) });
    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });
});
