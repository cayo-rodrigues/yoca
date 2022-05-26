import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

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
    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const listOneGenFeedback = await request(app).get(
      `/feedbacks/general/${genFeedbackResponse.body.feedback.id}`
    );

    expect(listOneGenFeedback.status).toBe(200);
    expect(listOneGenFeedback.body).toEqual(
      expect.objectContaining({
        ...genFeedbackResponse.body.feedback,
      })
    );
  });
  it("Should not be able to list one general feedback sending unexistent id", async () => {
    const listOneGenFeedback = await request(app).get(
      "/feedbacks/general/5cee5a5f-169d-423b-8c48-64d27d2c59ed"
    );

    expect(listOneGenFeedback.status).toBe(404);
    expect(listOneGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "General feedback not found",
      })
    );
  });
});
