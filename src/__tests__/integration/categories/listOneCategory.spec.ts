import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" GET - /categories/:id ", () => {
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

  it("Should be able to list one category", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

    await request(app).post("/super").send({
      name: "testaurant",
      email: "admin@email.com",
      phone: "+55061940028922",
      password: "admin123",
    });

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("uuid");

    const createCategoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const listOneCategoryResponse = await request(app)
      .get("/categories/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneCategoryResponse.status).toBe(200);
    expect(listOneCategoryResponse.body).toEqual(
      expect.objectContaining({ id: "uuid", ...createCategoryResponse.body })
    );
  });

  it("Should not be able to list categories without being a registered user", async () => {
    const listCategoriesResponse = await request(app)
      .get("/categories/uuid")
      .set("Authorization", `Bearer unexistentUserToken`);

    expect(listCategoriesResponse.status).toBe(401);
    expect(listCategoriesResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to list one category with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const listOneCategoryResponse = await request(app)
      .get("/categories/aleatory-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneCategoryResponse.status).toBe(404);
    expect(listOneCategoryResponse.body).toEqual(
      expect.objectContaining({
        message: "Category not found",
      })
    );
  });
});
