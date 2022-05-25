import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" DELETE - /categories/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockCategory = {
    name: "veganos",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to delete one category", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "S3nh@F0rt3",
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    uuidSpy.mockReturnValueOnce("uuid");

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const delOneCategoryResponse = await request(app)
      .delete(`/categories/${createCategoryResponse.body.category.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delOneCategoryResponse.status).toBe(204);
    expect(delOneCategoryResponse.body).toMatchObject({});
  });

  it("Should not be able to delete category without accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "S3nh@F0rt3",
    });

    uuidSpy.mockReturnValueOnce("without-access-uuid");
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

    const delCategoriesResponse = await request(app)
      .delete("/categories/uuid")
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

    const delOneCategoryResponse = await request(app)
      .delete("/categories/aleatory-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delOneCategoryResponse.status).toBe(404);
    expect(delOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category not found",
      })
    );
  });
});
