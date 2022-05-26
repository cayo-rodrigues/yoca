import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";

describe("DELETE - /feedbacks/general/:id", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    await request(app).post("/super").send({
      name: "testaurat",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "S3nh@F0rt3",
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
      password: "S3nh@F0rt3",
    });

    const deleteGenFeedback = await request(app)
      .delete(`/feedbacks/general/${genFeedbackResponse.body.feedback.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    console.log(deleteGenFeedback);

    expect(deleteGenFeedback.status).toBe(204);
    expect(deleteGenFeedback.body).toHaveLength(0);
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
      password: "S3nh@F0rt3",
    });

    const withoutAccessResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "S3nh@F0rt3",
        accessLevel: 4,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "S3nh@F0rt3",
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
    const deleteGenFeedback = await request(app).delete(
      "/feedbacks/general/5cee5a5f-169d-423b-8c48-64d27d2c59ed"
    );

    expect(deleteGenFeedback.status).toBe(404);
    expect(deleteGenFeedback.body).toEqual(
      expect.objectContaining({
        message: "Feedback not found",
      })
    );
  });
});
