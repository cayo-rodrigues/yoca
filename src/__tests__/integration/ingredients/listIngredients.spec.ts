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

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);
    const listIngredientsResponse = await request(app)
      .get("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listIngredientsResponse.status).toBe(200);
    expect(listIngredientsResponse.body).toHaveProperty("reduce");
    expect(listIngredientsResponse.body).toEqual(
      expect.arrayContaining([
        {
          ...createIngredientResponse.body.ingredient,
          amount: createIngredientResponse.body.ingredient.amount.toFixed(2),
          amountMin:
            createIngredientResponse.body.ingredient.amountMin.toFixed(2),
          amountMax:
            createIngredientResponse.body.ingredient.amountMax.toFixed(2),
        },
      ])
    );
  });

  it("Should not be able to list ingredients without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "12345678",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
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
