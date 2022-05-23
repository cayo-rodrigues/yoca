import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
jest.mock("uuid");

describe("DELETE - /feedbacks/product/:id", () => {
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

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete one product feedback", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurat",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "admin123",
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });
    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    const deleteGenFeedback = await request(app)
      .delete("/feedbacks/product/prod-fb-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteGenFeedback.status).toBe(204);
    expect(deleteGenFeedback.body).toHaveLength(0);
    expect(
      (
        await request(app)
          .delete("/feedbacks/product/prod-fb-uuid")
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete one product feedback without accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("without-access-uuid");
    const withoutAccessResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "12345678",
        accessLevel: 4,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    uuidSpy.mockReturnValueOnce("prod-fb-uuid");

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/product")
      .send(mockProductFeedback);

    const deleteGenFeedback = await request(app)
      .delete("/feedbacks/product/prod-fb-uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(deleteGenFeedback.status).toBe(401);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete one product feedback sending unexistent id", async () => {
    const deleteGenFeedback = await request(app).delete(
      "/feedbacks/product/unex-prod-fb-uuid"
    );

    expect(deleteGenFeedback.status).toBe(404);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
