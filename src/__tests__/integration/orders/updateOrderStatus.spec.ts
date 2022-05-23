import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe("PATCH - /orders/:id", () => {
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
    ingredients: [{ ingredientId: "ingredient-uuid", amount: "100" }],
    categories: ["massas"],
  };

  const mockOrder = {
    table: "47",
    products: [
      {
        productId: "product-uuid",
        quantity: 2,
      },
    ],
    billId: 1,
    employeeId: "waiter-uuid",
  };

  const mockOrderUpdates = {
    status: "Ready",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an order", async () => {
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

    uuidSpy.mockReturnValueOnce("waiter-uuid");
    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "1234567891011",
        password: "12345678",
        accessLevel: 3,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: "12345678",
    });

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    uuidSpy.mockReturnValueOnce("massas-uuid");
    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
      });

    uuidSpy.mockReturnValueOnce("ingredient-uuid");
    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    uuidSpy.mockReturnValueOnce("product-uuid");
    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockProduct);

    uuidSpy.mockReturnValueOnce("order-uuid");
    const createOrderResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockOrder);

    const updateOrderResponse = await request(app)
      .patch("/orders/order-uuid")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockOrderUpdates);

    expect(updateOrderResponse.status).toBe(201);
    expect(updateOrderResponse.body).toMatchObject({
      message: "Order updated",
      order: {
        id: "order-uuid",
        ...mockOrder,
        status: "Ready",
        total: mockProduct.price * mockOrder.products[0].quantity,
      },
    });
  });
  it("Should not be able to update an order with accessLevel greater than 4", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });
    uuidSpy.mockReturnValueOnce("without-access-waiter");
    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "1234567891011",
        password: "12345678",
        accessLevel: 5,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const updateOrderResponse = await request(app)
      .patch("/orders/order-uuid")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send({ status: "Paid" });

    expect(updateOrderResponse.status).toBe(401);
    expect(updateOrderResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
