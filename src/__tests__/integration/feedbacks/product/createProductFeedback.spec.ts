import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
import { clearDB } from "../../../connection";
jest.mock("uuid");

describe("POST - /feedbacks/product", () => {
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

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create an product feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    expect(genFeedbackResponse.status).toBe(201);
    expect(genFeedbackResponse.body).toMatchObject({
      message: "Feedback created",
      feedback: {
        id: "prod-fb-uuid",
        ...mockProductFeedback,
      },
    });
  });
});
