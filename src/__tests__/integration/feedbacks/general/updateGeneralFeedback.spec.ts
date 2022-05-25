import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
import { clearDB } from "../../../connection";
jest.mock("uuid");

describe("UPDATE - /feedbacks/general/:id", () => {
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

  const mockGeneralFeedbackUpdates = {
    description:
      "Finalmente um restaurante que serve talher de peixe, porém, poderia ser de porcelana",
    rating: 4.5,
  };

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update one general feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("gen-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const updateGenFeedback = await request(app)
      .patch("/feedbacks/general/gen-fb-uuid")
      .send(mockGeneralFeedbackUpdates);

    expect(updateGenFeedback.status).toBe(200);
    expect(updateGenFeedback.body).toMatchObject({
      message: "Feedback updated",
      feedback: {
        id: "gen-fb-uuid",
        ...mockGeneralFeedbackUpdates,
      },
    });
  });
  it("Should not be able to update one general feedback sending unexistent id", async () => {
    const updateGenFeedback = await request(app).patch(
      "/feedbacks/general/unex-gen-fb-uuid"
    );

    expect(updateGenFeedback.status).toBe(404);
    expect(updateGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
