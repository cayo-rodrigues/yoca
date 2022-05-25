import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
import { clearDB } from "../../../connection";
jest.mock("uuid");

describe("GET - /feedbacks/product/:id", () => {
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

  it("Should be able to list one product feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    const listOneGenFeedback = await request(app).get(
      "/feedbacks/product/prod-fb-uuid"
    );

    expect(listOneGenFeedback.status).toBe(200);
    expect(listOneGenFeedback.body).toMatchObject({
      id: "prod-fb-uuid",
      ...mockProductFeedback,
    });
  });
  it("Should not be able to list one product feedback sending unexistent id", async () => {
    const listOneGenFeedback = await request(app).get(
      "/feedbacks/product/unex-prod-fb-uuid"
    );

    expect(listOneGenFeedback.status).toBe(404);
    expect(listOneGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
