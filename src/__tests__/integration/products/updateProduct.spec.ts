import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { TESTS_PASSWORD } from "../../../utils";

type ProductUpdatesResponse = {
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

describe(" PATCH - /products/:id ", () => {
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
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing product", async () => {
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

    const updateProductResponse = await request(app)
      .patch(`/products/${createProductResponse.body.product.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(productUpdates);

    expect(updateProductResponse.status).toBe(200);
    expect(updateProductResponse.body).toMatchObject<ProductUpdatesResponse>({
      message: "Product updated",
      product: {
        ...createProductResponse.body.product,
        name: "Pizza de cenoura",
        price: 10.99,
        calories: "300.00",
      },
    });
  });
  it("Should not be able to update an existing product without sending accessLevel 1 or 2", async () => {
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

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const updateProductResponse = await request(app)
      .patch(`/products/${listProducts.body.results[0].id}`)
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
      password: TESTS_PASSWORD,
    });
    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const updateProductResponse = await request(app)
      .patch(`/products/${listProducts.body.results[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        ingredients: [
          { id: "b646c6bb-b830-404e-94ee-3fb347b98d97", amount: "150" },
        ],
      });

    expect(updateProductResponse.status).toBe(400);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of ingredients ids",
      })
    );
  });
  it("Should not be able to update a product sending unexistent categories", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const listProducts = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const listIngredients = await request(app)
      .get("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const updateProductResponse = await request(app)
      .patch(`/products/${listProducts.body.results[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [
          { id: listIngredients.body.results[0].id, amount: "100" },
        ],
        categories: [listIngredients.body.results[0].id],
      });

    expect(updateProductResponse.status).toBe(400);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of categories ids",
      })
    );
  });
});
