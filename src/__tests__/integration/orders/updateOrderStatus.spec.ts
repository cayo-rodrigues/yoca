import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

type OrderUpdatesResponse = {
  message: string;
  order: {
    table: string;
    status: "Ready";
    total: number;
    billId: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

describe("PATCH - /orders/:id", () => {
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

  const mockOrderUpdates = {
    status: "ready",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an order", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Johnny doe",
        email: "johnnydoe@email.com",
        phone: "1234567891011",
        password: TESTS_PASSWORD,
        accessLevel: 3,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: TESTS_PASSWORD,
    });

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    const categoriesResponse = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
      });

    const ingredientsResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    const productResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Pizza",
        price: 4.99,
        calories: 300,
        ingredients: [
          {
            id: ingredientsResponse.body.ingredient.id,
            amount: "45",
          },
        ],
        categories: [categoriesResponse.body.category.id],
      });
    const mockOrder = {
      table: "100",
      ordersProducts: [
        {
          quantity: 1,
          productId: productResponse.body.product.id,
        },
      ],
      billId: billResponse.body.bill.id,
      employeeId: waiterResponse.body.employee.id,
    };
    const createOrderResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockOrder);

    const updateOrderResponse = await request(app)
      .patch(`/orders/${createOrderResponse.body.order.id}`)
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockOrderUpdates);

    expect(updateOrderResponse.status).toBe(201);
    expect(updateOrderResponse.body).toMatchObject<OrderUpdatesResponse>({
      message: "Order status updated",
      order: {
        ...updateOrderResponse.body.order,
        status: "ready",
      },
    });
  });
  it("Should not be able to update an order with accessLevel greater than 4", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const waiterResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "1234567891011",
        password: TESTS_PASSWORD,
        accessLevel: 5,
      });

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
    });

    const updateOrderResponse = await request(app)
      .patch("/orders/25d3ece6-c84f-4182-a23e-d4e7ca117cc5")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send({ status: "served" });

    expect(updateOrderResponse.status).toBe(401);
    expect(updateOrderResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
