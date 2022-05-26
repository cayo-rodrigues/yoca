import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

describe(" GET - /ingredients/:id ", () => {
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
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list one ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);
    const listOneIngredientResponse = await request(app)
      .get(`/ingredients/${createIngredientResponse.body.ingredient.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneIngredientResponse.status).toBe(200);
    expect(listOneIngredientResponse.body).toEqual(
      expect.objectContaining({
        ...createIngredientResponse.body.ingredient,
        amount: "50.00",
        amountMax: "100.00",
        amountMin: "15.00",
      })
    );
  });

  it("Should not be able to list one ingredient without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    await request(app)
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
    const listOneIngredientResponse = await request(app)
      .get(`/ingredients/25d3ece6-c84f-4182-a23e-d4e7ca117cc5`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(listOneIngredientResponse.status).toBe(401);
    expect(listOneIngredientResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
