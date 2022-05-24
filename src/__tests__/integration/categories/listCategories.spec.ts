import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { clearDB } from "../../connection";

describe(" GET - /categories ", () => {
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

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all categories", async () => {
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

    const categoryResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockCategory);

    const listCategoriesResponse = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listCategoriesResponse.status).toBe(200);
    expect(listCategoriesResponse.body).toHaveProperty("reduce");
    expect(listCategoriesResponse.body).toEqual(
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
