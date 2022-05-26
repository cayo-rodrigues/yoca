import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

type IngredientUpdatesResponse = {
  message: string;
  ingredient: {
    id: string;
    name: string;
    measure: string;
    amount: number;
    amount_max: number;
    amount_min: number;
    createdAt: Date;
    updatedAt: Date;
  };
};

describe(" PATCH - /ingredients/:id ", () => {
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
      password: "admin123",
    });
  });

  const mockIngredient = {
    name: "Batata",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };

  const ingredientUpdates = {
    name: "Batata Baroa",
    measure: "kg",
    amount: 70,
    amountMax: 100,
    amountMin: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const updateIngredientResponse = await request(app)
      .patch(`/ingredients/${createIngredientResponse.body.ingredient.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(ingredientUpdates);

    expect(updateIngredientResponse.status).toBe(200);
    expect(
      updateIngredientResponse.body
    ).toMatchObject<IngredientUpdatesResponse>({
      message: "Ingredient updated",
      ingredient: {
        ...updateIngredientResponse.body.updatedIngredient,
        ...ingredientUpdates,
      },
    });
  });
  it("Should not be able to update an existing ingredient without sending accessLevel 1 or 2", async () => {
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

    const updateIngredientResponse = await request(app)
      .patch("/ingredients/5cee5a5f-169d-423b-8c48-64d27d2c59ed")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send(mockIngredient);

    expect(updateIngredientResponse.status).toBe(401);
    expect(updateIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
