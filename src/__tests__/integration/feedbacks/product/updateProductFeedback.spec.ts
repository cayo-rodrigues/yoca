import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
jest.mock("uuid");

describe("UPDATE - /feedbacks/product/:id", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockProductFeedback = {
    product: "Pizza",
    description:
      "Massa muito grossa, não consegui bater meu recorde de 45 fatias :(",
    rating: 2,
  };
  const mockProductFeedbackUpdates = {
    product: "Pizza",
    description:
      "Massa muito grossa, não consegui bater meu recorde de 45 fatias. Mas a pizza de cenoura estava bem gostosa, comi 7 hehehe.",
    rating: 2.5,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update one product feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    const updateGenFeedback = await request(app)
      .patch("/feedbacks/product/prod-fb-uuid")
      .send(mockProductFeedbackUpdates);

    expect(updateGenFeedback.status).toBe(200);
    expect(updateGenFeedback.body).toMatchObject({
      message: "Feedback updated",
      feedback: {
        id: "prod-fb-uuid",
        ...mockProductFeedbackUpdates,
      },
    });
  });
  it("Should not be able to update one product feedback sending unexistent id", async () => {
    const updateGenFeedback = await request(app).patch(
      "/feedbacks/product/unex-prod-fb-uuid"
    );

    expect(updateGenFeedback.status).toBe(404);
    expect(updateGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
