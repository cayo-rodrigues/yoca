import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
import { clearDB } from "../../connection";
jest.mock("uuid");

describe(" PATCH - /products/:id ", () => {
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
    amountMax: 100,
    amountMin: 15,
  };

  const mockProduct = {
    name: "Pizza",
    price: 4.99,
    calories: 300,
    ingredients: [{ ingredientId: "uuid", amount: "100" }],
    categories: ["massas"],
  };

  const productUpdates = {
    name: "Pizza de cenoura",
    price: 10.99,
    calories: 500,
    ingredients: [
      { ingredientId: "uuid", amount: "100" },
      { ingredientId: "uuid2", amount: "100" },
    ],
    categories: ["massas", "veganos"],
  };
  
  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing product", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValueOnce("super-uuid");

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

    uuidSpy.mockReturnValueOnce("massas-uuid");
    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
      });

    uuidSpy.mockReturnValueOnce("veganos-uuid");
    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "veganos-uuid",
      });

    uuidSpy.mockReturnValueOnce("uuid");
    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    uuidSpy.mockReturnValueOnce("uuid2");
    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batata Baroa",
        measure: "kg",
        amount: 70,
        amountMax: 100,
        amountMin: 15,
      });

    uuidSpy.mockReturnValueOnce("uuid");
    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockProduct);

    const updateProductResponse = await request(app)
      .patch("/products/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(productUpdates);

    expect(updateProductResponse.status).toBe(200);
    expect(updateProductResponse.body).toMatchObject({
      message: "Product updated",
      product: {
        id: "uuid",
        ...productUpdates,
      },
    });
  });
  it("Should not be able to update an existing product without sending accessLevel 1 or 2", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    uuidSpy.mockReturnValueOnce("some-uuid");
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

    const updateProductResponse = await request(app)
      .patch("/products/uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send(mockProduct);

    expect(updateProductResponse.status).toBe(401);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to update a product sending unexistent ingredients", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const updateProductResponse = await request(app)
      .patch("/products/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [{ ingredientId: "uuid-batata", amount: "100" }],
        categories: ["massas"],
      });

    expect(updateProductResponse.status).toBe(404);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Ingredients does not exist",
      })
    );
  });
  it("Should not be able to update a product sending unexistent categories", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const updateProductResponse = await request(app)
      .patch("/products/uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [{ ingredientId: "uuid", amount: "100" }],
        categories: ["iguarias"],
      });

    expect(updateProductResponse.status).toBe(404);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Categories does not exist",
      })
    );
  });
});
