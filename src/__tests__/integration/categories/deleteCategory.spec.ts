import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" DELETE - /categories/:id ", () => {
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

  it("Should be able to delete one category", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const delOneCategoryResponse = await request(app)
      .delete(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delOneCategoryResponse.status).toBe(204);
    expect(delOneCategoryResponse.body).toMatchObject({});
    expect(
      (
        await request(app)
          .delete(`/categories/${createCategoryResponse.body.category.id}`)
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });

  it("Should not be able to delete category without accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "S3nh@F0rt3",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const delCategoriesResponse = await request(app)
      .delete(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delCategoriesResponse.status).toBe(401);
    expect(delCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to delete one category with unexistent id", async () => {
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

    const delOneCategoryResponse = await request(app)
      .delete(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delOneCategoryResponse.status).toBe(404);
    expect(delOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category not found",
      })
    );
  });
});
