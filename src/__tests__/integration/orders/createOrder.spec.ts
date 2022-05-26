import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

type OrderResponse = {
  warning?: string;
  message: string;
  order: {
    table: string;
    status: "Pending";
    total: number;
    billId: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
describe("POST - /orders", () => {
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

  it("Should be able to create an order", async () => {
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

    expect(createOrderResponse.status).toBe(201);
    expect(createOrderResponse.body).toMatchObject<OrderResponse>({
      warning: "cenoura is below amount min",
      message: "Order created",
      order: {
        ...createOrderResponse.body.order,
        status: "pending",
        total:
          productResponse.body.product.price *
          mockOrder.ordersProducts[0].quantity,
      },
    });
  });
  it("Should not be able to create an order with products using extra amount of ingredients", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const listWaiters = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: TESTS_PASSWORD,
    });

    const billResponse = await request(app)
      .post("/bills")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`);

    const mockOrder = {
      table: "100",
      ordersProducts: [
        {
          quantity: 1,
          productId: listProducts.body.results[0].id,
        },
      ],
      billId: billResponse.body.bill.id,
      employeeId: listWaiters.body.results[0].id,
    };

    const createOrderResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send(mockOrder);

    expect(createOrderResponse.status).toBe(400);
    expect(createOrderResponse.body).toEqual(
      expect.objectContaining({
        message: "Insufficient stock for this order",
      })
    );
  });
  it("Should not be able to create an order sending unexistent billId", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const listWaiters = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: TESTS_PASSWORD,
    });

    const createOrderResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send({
        table: "47",
        ordersProducts: [
          {
            productId: listProducts.body.results[0].id,
            quantity: 2,
          },
        ],
        billId: 5,
        employeeId: listWaiters.body.results[0].id,
      });

    expect(createOrderResponse.status).toBe(404);
    expect(createOrderResponse.body).toEqual(
      expect.objectContaining({
        message: "Bill not found",
      })
    );
  });
  it("Should not be able to create an order sending unexistent employeeId", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const waiterLoginResponse = await request(app).post("/sessions").send({
      email: "johnnydoe@email.com",
      password: TESTS_PASSWORD,
    });

    const createOrderResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${waiterLoginResponse.body.token}`)
      .send({
        table: "47",
        ordersProducts: [
          {
            productId: listProducts.body.results[0].id,
            quantity: 2,
          },
        ],
        billId: 1,
        employeeId: listProducts.body.results[0].id,
      });

    expect(createOrderResponse.status).toBe(404);
    expect(createOrderResponse.body).toEqual(
      expect.objectContaining({
        message: "Employee not found",
      })
    );
  });
});
