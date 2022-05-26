import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /categories/:id ", () => {
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

  it("Should be able to list one category", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const listOneCategoryResponse = await request(app)
      .get(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneCategoryResponse.status).toBe(200);
    expect(listOneCategoryResponse.body).toEqual(
      expect.objectContaining({ ...createCategoryResponse.body.category })
    );
  });

  it("Should not be able to list one category without being a registered user", async () => {
    const listCategoriesResponse = await request(app).get("/categories/uuid");

    expect(listCategoriesResponse.status).toBe(401);
    expect(listCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Missing authorization headers" })
    );
  });
  it("Should not be able to list one category with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "cat eagle laugh" });

    await request(app)
      .delete(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const listOneCategoryResponse = await request(app)
      .get(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneCategoryResponse.status).toBe(404);
    expect(listOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category not found",
      })
    );
  });
});
