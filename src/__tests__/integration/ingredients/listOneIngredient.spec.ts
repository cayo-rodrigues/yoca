import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

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

  it("Should be able to list one ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("uuid");

    const createIngredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const listOneIngredientResponse = await request(app)
      .get("/ingredients/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listOneIngredientResponse.status).toBe(200);
    expect(listOneIngredientResponse.body).toEqual(
      expect.objectContaining({ id: "uuid", ...createIngredientResponse.body })
    );
  });

  it("Should not be able to list one ingredient without sending accessLevel 1 or 2", async () => {
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
    const listOneIngredientResponse = await request(app)
      .get("/ingredients")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(listOneIngredientResponse.status).toBe(401);
    expect(listOneIngredientResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
