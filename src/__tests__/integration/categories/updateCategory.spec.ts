import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

type CategoryUpdatesResponse = {
  message: string;
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

describe(" PATCH - /categories/:id ", () => {
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

  const categoryUpdates = {
    name: "vegans",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update one category", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const updateOneCategoryResponse = await request(app)
      .patch(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(categoryUpdates);

    expect(updateOneCategoryResponse.status).toBe(200);
    expect(
      updateOneCategoryResponse.body
    ).toMatchObject<CategoryUpdatesResponse>({
      message: "Category updated",
      category: {
        ...updateOneCategoryResponse.body.category,
        ...categoryUpdates,
      },
    });
  });

  it("Should not be able to update category without accessLevel 1 or 2", async () => {
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

    const updateCategoriesResponse = await request(app)
      .patch(`/categories/${withoutAccessUser.body.employee.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(updateCategoriesResponse.status).toBe(401);
    expect(updateCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to update one category with repeated name", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const updateOneCategoryResponse = await request(app)
      .patch(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(categoryUpdates);

    expect(updateOneCategoryResponse.status).toBe(409);
    expect(updateOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category with this name already exists",
      })
    );
  });
  it("Should not be able to update one category with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    const createCategoryResponse = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    await request(app)
      .delete(`/categories/${createCategoryResponse.body.results[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const updateOneCategoryResponse = await request(app)
      .patch(`/categories/${createCategoryResponse.body.results[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({ name: "cat eagle laugh" });

    expect(updateOneCategoryResponse.status).toBe(404);
    expect(updateOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category not found",
      })
    );
  });
});
