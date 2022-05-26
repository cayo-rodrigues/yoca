import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
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

  const mockSuperUser = {
    name: "testaurat",
    email: "admin@email.com",
    phone: "+55061940028922",
    password: "Admin123",
  };

  const mockEmployee = {
    name: "John doe",
    email: "johndoe@email.com",
    phone: "999999999999",
    password: "Aa12345678",
    accessLevel: 3,
  };

  const mockCategory = {
    id: "uuid",
    name: "massas",
  };

  const mockCategoryTwo = {
    id: "uuid",
    name: "veganos",
  };

  const mockIngredient = {
    id: "uuid",
    name: "Cenoura",
    measure: "kg",
    amount: 50,
    amountMax: 100,
    amountMin: 15,
  };

  const mockIngredientTwo = {
    id: "uuid",
    name: "Batata Baroa",
    measure: "kg",
    amount: 70,
    amountMax: 100,
    amountMin: 15,
  };

  const mockProduct = {
    id: "uuid",
    name: "Pizza",
    price: 4.99,
    calories: 300,
    ingredients: [{ id: "uuid", amount: "100" }],
    categories: ["uuid"],
  };

  const mockProductUpdate = {
    name: "Pizza de cenoura",
    price: 10.99,
    calories: 500,
    ingredients: [
      { id: "uuid", amount: "100" },
      { id: "uuid", amount: "100" },
    ],
    categories: ["uuid", "uuid"],
  };

  type ProductUpdatesResponse = {
    message: string;
    product: {
      id: string;
      name: string;
      price: number;
      calories: number;
      ingredients: { id: string; amount: string }[];
      categories: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  };

  interface IAttMocks {
    idProduct?: string;
    idIngredient?: string;
    idCategory?: string;
    idIngredientTwo?: string;
    idCategoryTwo?: string;
  }

  const attMocks = ({
    idProduct,
    idIngredient,
    idCategory,
    idCategoryTwo,
    idIngredientTwo,
  }: IAttMocks) => {
    mockProduct.id = idProduct ? idProduct : mockProduct.id;
    mockIngredient.id = idIngredient ? idIngredient : mockIngredient.id;
    mockCategory.id = idCategory ? idCategory : mockCategory.id;
    mockCategoryTwo.id = idCategoryTwo ? idCategoryTwo : mockCategoryTwo.id;
    mockIngredientTwo.id = idIngredientTwo
      ? idIngredientTwo
      : mockIngredientTwo.id;
    mockProduct.ingredients[0].id = mockIngredient.id;
    mockProduct.categories[0] = mockCategory.id;
    mockProductUpdate.ingredients[0].id = mockIngredient.id;
    mockProductUpdate.categories[0] = mockCategory.id;
    mockProductUpdate.ingredients[1].id = mockIngredientTwo.id;
    mockProductUpdate.categories[1] = mockCategoryTwo.id;
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to update an existing product", async () => {
    await request(app).post("/super").send(mockSuperUser);

    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(mockCategory)
      .then(({ body: { category } }) => {
        attMocks({ idCategory: category.id });
      });

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(mockCategoryTwo)
      .then(({ body: { category } }) => {
        attMocks({ idCategoryTwo: category.id });
      });

    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${token}`)
      .send(mockIngredient)
      .then(({ body: { ingredient } }) => {
        attMocks({ idIngredient: ingredient.id });
      });

    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${token}`)
      .send(mockIngredientTwo)
      .then(({ body: { ingredient } }) => {
        attMocks({ idIngredientTwo: ingredient.id });
      });

    const createProduct = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct)
      .then((res) => {
        attMocks({ idProduct: res.body.product.id });
        return res;
      });

    const updateProductResponse = await request(app)
      .patch(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(mockProductUpdate);

    expect(updateProductResponse.status).toBe(200);
    expect(updateProductResponse.body).toMatchObject<ProductUpdatesResponse>({
      message: "Product updated",
      product: {
        ...createProduct.body.product,
        name: mockProductUpdate.name,
        price: mockProductUpdate.price,
        calories: mockProductUpdate.calories,
      },
    });
  });

  it("Should not be able to update an existing product without sending accessLevel 1 or 2", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send(mockSuperUser);

    await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${token}`)
      .send(mockEmployee);

    const {
      body: { token: tokenEmployee },
    } = await request(app).post("/sessions").send({
      email: mockEmployee.email,
      password: mockEmployee.password,
    });

    const updateProductResponse = await request(app)
      .patch(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send(mockProduct);

    expect(updateProductResponse.status).toBe(401);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  it("Should not be able to update a product sending unexistent ingredients", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    const updateProductResponse = await request(app)
      .patch(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [
          { id: mockProduct.ingredients[0].id, amount: "100" },
          { id: mockProduct.id, amount: "10" },
        ],
        categories: [mockProductUpdate.categories[1]],
      });

    expect(updateProductResponse.status).toBe(400);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of ingredients ids",
      })
    );
  });

  it("Should not be able to update a product sending unexistent categories", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    const updateProductResponse = await request(app)
      .patch(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        categories: [mockProduct.id],
      });

    expect(updateProductResponse.status).toBe(400);
    expect(updateProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of categories ids",
      })
    );
  });
});
