import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

describe("GET - /feedbacks/general", () => {
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

  it("Should be able to list general feedbacks", async () => {
    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const listGenFeedbacks = await request(app).get("/feedbacks/general");

    expect(listGenFeedbacks.status).toBe(200);
    expect(listGenFeedbacks.body.results).toHaveProperty("reduce");
    expect(listGenFeedbacks.body.results).toEqual(
      expect.arrayContaining([genFeedbackResponse.body.feedback])
    );
  });
});
