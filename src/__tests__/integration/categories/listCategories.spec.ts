import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /categories ", () => {
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
      password: "S3nh@F0rt3",
    });
  });

  const mockCategory = {
    name: "veganos",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all categories", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const listCategoriesResponse = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listCategoriesResponse.status).toBe(200);
    expect(listCategoriesResponse.body.results).toHaveProperty("reduce");
    expect(listCategoriesResponse.body.results).toEqual(
      expect.arrayContaining([categoryResponse.body.category])
    );
  });

  it("Should not be able to list categories without being a registered user", async () => {
    const listCategoriesResponse = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer unexistentUserToken`);

    expect(listCategoriesResponse.status).toBe(401);
    expect(listCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
