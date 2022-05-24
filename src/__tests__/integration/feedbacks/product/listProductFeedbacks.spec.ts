import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
import { clearDB } from "../../../connection";
jest.mock("uuid");

describe("GET - /feedbacks/product", () => {
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

  it("Should be able to list product feedbacks", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    const listGenFeedbacks = await request(app).get("/feedbacks/product");

    expect(listGenFeedbacks.status).toBe(200);
    expect(listGenFeedbacks.body).toHaveProperty("reduce");
    expect(listGenFeedbacks.body).toEqual(
      expect.arrayContaining([prodFeedbackResponse.body.feedback])
    );
  });
});
