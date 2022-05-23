import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
jest.mock("uuid");

describe("POST - /feedbacks/general", () => {
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

  it("Should be able to create an general feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("gen-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    expect(genFeedbackResponse.status).toBe(201);
    expect(genFeedbackResponse.body).toMatchObject({
        message: "Feedback created",
        feedback: {
            id: "gen-fb-uuid",
            ...mockGeneralFeedback
        }
    })  
  });
});
