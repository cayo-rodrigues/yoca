import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
jest.mock("uuid");

describe("GET - /feedbacks/general/:id", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockGeneralFeedback = {
    description: "Finalmente um restaurante que serve talher de peixe",
    rating: 5,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list one general feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("gen-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const listOneGenFeedback = await request(app).get(
      "/feedbacks/general/gen-fb-uuid"
    );

    expect(listOneGenFeedback.status).toBe(200);
    expect(listOneGenFeedback.body).toMatchObject({
      id: "gen-fb-uuid",
      ...mockGeneralFeedback,
    });
  });
  it("Should not be able to list one general feedback sending unexistent id", async () => {
    const listOneGenFeedback = await request(app).get(
      "/feedbacks/general/unex-gen-fb-uuid"
    );

    expect(listOneGenFeedback.status).toBe(404);
    expect(listOneGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
