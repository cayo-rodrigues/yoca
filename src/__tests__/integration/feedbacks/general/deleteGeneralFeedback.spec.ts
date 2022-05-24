import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

import * as uuid from "uuid";
import { clearDB } from "../../../connection";
jest.mock("uuid");

describe("DELETE - /feedbacks/general/:id", () => {
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

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete one general feedback", async () => {
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
    uuidSpy.mockReturnValueOnce("gen-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const deleteGenFeedback = await request(app)
      .delete("/feedbacks/general/gen-fb-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteGenFeedback.status).toBe(204);
    expect(deleteGenFeedback.body).toHaveLength(0);
    expect(
      (
        await request(app)
          .delete("/feedbacks/general/gen-fb-uuid")
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete one general feedback without accessLevel 1 or 2", async () => {
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

    uuidSpy.mockReturnValueOnce("gen-fb-uuid");

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const deleteGenFeedback = await request(app)
      .delete("/feedbacks/general/gen-fb-uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(deleteGenFeedback.status).toBe(401);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete one general feedback sending unexistent id", async () => {
    const deleteGenFeedback = await request(app).delete(
      "/feedbacks/general/unex-gen-fb-uuid"
    );

    expect(deleteGenFeedback.status).toBe(404);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
