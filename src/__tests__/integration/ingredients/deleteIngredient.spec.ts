import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

describe(" DELETE - /ingredients/:id ", () => {
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

  it("Should be able to delete an ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const delIngredientResponse = await request(app)
      .delete(`/ingredients/${createIngredientResponse.body.ingredient.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delIngredientResponse.status).toBe(204);
    expect(delIngredientResponse.body).toEqual({});
    expect(
      (
        await request(app)
          .delete(`/ingredients/${createIngredientResponse.body.ingredient.id}`)
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete an ingredient without sending accessLevel 1 or 2", async () => {
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

    const delIngredientResponse = await request(app)
      .delete("/ingredients/5cee5a5f-169d-423b-8c48-64d27d2c59ed")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delIngredientResponse.status).toBe(401);
    expect(delIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete an ingredient with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const delIngredientResponse = await request(app)
      .delete("/ingredients/5cee5a5f-169d-423b-8c48-64d27d2c59ed")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delIngredientResponse.status).toBe(404);
    expect(delIngredientResponse.body).toEqual(
      expect.objectContaining({ message: "Ingredient not found" })
    );
  });
});
