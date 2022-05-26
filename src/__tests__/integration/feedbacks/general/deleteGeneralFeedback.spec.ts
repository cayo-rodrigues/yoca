import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";
import { TESTS_PASSWORD } from "../../../../utils";

describe("DELETE - /feedbacks/general/:id", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: TESTS_PASSWORD,
    });
  });

  const mockGeneralFeedback = {
    description: "Finalmente um restaurante que serve talher de peixe",
    rating: 5,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete one general feedback", async () => {
    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const deleteGenFeedback = await request(app)
      .delete(`/feedbacks/general/${genFeedbackResponse.body.feedback.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteGenFeedback.status).toBe(204);
    expect(deleteGenFeedback.body).toMatchObject({});
    expect(
      (
        await request(app)
          .delete(`/feedbacks/general/${genFeedbackResponse.body.feedback.id}`)
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete one general feedback without accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const withoutAccessResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: TESTS_PASSWORD,
        accessLevel: 4,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
    });

    const genFeedbackResponse = await request(app)
      .post("/feedbacks/general")
      .send(mockGeneralFeedback);

    const deleteGenFeedback = await request(app)
      .delete(`/feedbacks/general/${genFeedbackResponse.body.feedback.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(deleteGenFeedback.status).toBe(401);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete one general feedback sending unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const deleteGenFeedback = await request(app)
      .delete("/feedbacks/general/5cee5a5f-169d-423b-8c48-64d27d2c59ed")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteGenFeedback.status).toBe(404);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "General feedback not found",
      })
    );
  });
});
