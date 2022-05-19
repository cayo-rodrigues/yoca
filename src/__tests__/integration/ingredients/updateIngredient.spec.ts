import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" PATCH - /ingredients/:id ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockIngredient = {
    name: "Batata",
    measure: "kg",
    amount: 50,
    amount_max: 100,
    amount_min: 15,
  };

  const ingredientUpdates = {
    name: "Batata Baroa",
    measure: "kg",
    amount: 70,
    amount_max: 100,
    amount_min: 15,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing ingredient", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const updateIngredientResponse = await request(app)
      .patch("/ingredients/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(ingredientUpdates);

    expect(updateIngredientResponse.status).toBe(200);
    expect(updateIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Ingredient updated",
        ingredient: {
          id: "uuid",
          ...ingredientUpdates,
        },
      })
    );
  });
  it("Should not be able to update an existing ingredient without sending access_level 1 or 2", async () => {
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

    const updateIngredientResponse = await request(app)
      .patch("/ingredients/uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send(ingredientUpdates);

    expect(updateIngredientResponse.status).toBe(401);
    expect(updateIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
