import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

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
      password: "admin",
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
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const delIngredientResponse = await request(app)
      .delete("/ingredients/some-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delIngredientResponse.status).toBe(204);
    expect(delIngredientResponse.body).toHaveLength(0);
    expect((await request(app).delete("/ingredients/some-uuid")).status).toBe(
      404
    );
  });
  it("Should not be able to delete an ingredient without sending accessLevel 1 or 2", async () => {
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
        phone: "99999999999",
        password: "123456",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "123456",
    });
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const delIngredientResponse = await request(app)
      .delete("/ingredients/some-uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delIngredientResponse.status).toBe(401);
    expect(delIngredientResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete an ingredient without id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const delIngredientResponse = await request(app)
      .delete("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delIngredientResponse.status).toBe(400);
    expect(delIngredientResponse.body).toEqual(
      expect.objectContaining({ message: "Missing params id" })
    );
  });
  it("Should not be able to delete an ingredient with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const delIngredientResponse = await request(app)
      .delete("/ingredients/some-aleatory-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delIngredientResponse.status).toBe(404);
    expect(delIngredientResponse.body).toEqual(
      expect.objectContaining({ message: "Ingredient not found" })
    );
  });
});
