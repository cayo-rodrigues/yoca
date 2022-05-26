import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

type ProductResponse = {
  message: string;
  product: {
    name: string;
    price: number;
    calories: number;
    igredients: [
      { id: string; amount: string },
      { id: string; amount: string }
    ];
    categories: string[];
    createdAt: Date;
    updatedAt: Date;
  };
};

describe("POST - /products", () => {
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
      password: "S3nh@F0rt3",
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

  it("Should be able to create a product", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

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

    const createProductResponse = await request(app)
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

    expect(createProductResponse.status).toBe(201);
    expect(createProductResponse.body).toMatchObject<ProductResponse>({
      message: "Product created",
      product: {
        ...createProductResponse.body.product,
        name: "pizza",
        price: 4.99,
        calories: 300,
      },
    });
  });
  it("Should not be able to create a product without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const withoutAccessUser = await request(app)
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

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send({
        name: "Batatão recheado com cenoura",
        price: 4.99,
        calories: 300,
        ingredients: [
          { id: withoutAccessUser.body.employee.id, amount: "100" },
        ],
        categories: [withoutAccessUser.body.employee.id],
      });

    expect(createProductResponse.status).toBe(401);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to create a product with repeated name", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Pizza",
        price: 4.99,
        calories: 300,
        ingredients: [
          {
            id: "5cee5a5f-169d-423b-8c48-64d27d2c59ed",
            amount: "45",
          },
        ],
        categories: ["5cee5a5f-169d-423b-8c48-64d27d2c59ed"],
      });

    expect(createProductResponse.status).toBe(409);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Product with this name already exists",
      })
    );
  });
  it("Should not be able to create a product with unexistent ingredient", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [
          {
            id: "5cee5a5f-169d-423b-8c48-64d27d2c59ed",
            amount: 100,
          },
        ],
        categories: ["5cee5a5f-169d-423b-8c48-64d27d2c59ed"],
      });

    expect(createProductResponse.status).toBe(400);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of ingredients ids",
      })
    );
  });
});