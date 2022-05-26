import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

describe(" GET - /ingredients ", () => {
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

  const mockIngredient = {
    name: "cenoura",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all ingredients", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);
    const listIngredientsResponse = await request(app)
      .get("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listIngredientsResponse.status).toBe(200);
    expect(listIngredientsResponse.body.results).toHaveProperty("reduce");
    expect(listIngredientsResponse.body.results).toEqual(
      expect.arrayContaining([
        {
          ...createIngredientResponse.body.ingredient,
          amount: "50.00",
          amountMax: "100.00",
          amountMin: "15.00",
        },
      ])
    );
  });

  it("Should not be able to list ingredients without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: TESTS_PASSWORD,
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
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
