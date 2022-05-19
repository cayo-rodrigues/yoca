import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /ingredients ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockIngredient = {
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amount_max: 100,
    amount_min: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all ingredients", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);
    const listIngredientsResponse = await request(app).get("/ingredients");

    expect(listIngredientsResponse.status).toBe(200);
    expect(listIngredientsResponse.body).toHaveProperty("reduce");
    expect(listIngredientsResponse.body).toEqual(
      expect.arrayContaining([createIngredientResponse.body])
    );
  });

  it("Should not be able to list ingredients without sending access_level 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "4002-8922",
        password: "123456",
        access_level: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const listIngredientsResponse = await request(app)
      .get("/ingredients")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(listIngredientsResponse.status).toBe(401);
    expect(listIngredientsResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
