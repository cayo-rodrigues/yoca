import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe("POST - /products", () => {
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

  const mockIngredient = {
    id: "uuid",
    name: "Cenoura",
    measure: "kg",
    amount: 50,
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

  interface IAttMocks {
    idProduct?: string;
    idIngredient?: string;
    idCategory?: string;
  }

  const attMocks = ({ idProduct, idIngredient, idCategory }: IAttMocks) => {
    mockProduct.id = idProduct ? idProduct : mockProduct.id;
    mockIngredient.id = idIngredient ? idIngredient : mockIngredient.id;
    mockCategory.id = idCategory ? idCategory : mockCategory.id;
    mockProduct.ingredients[0].id = mockIngredient.id;
    mockProduct.categories[0] = mockCategory.id;
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create a product", async () => {
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
      .post("/ingredients")
      .set("Authorization", `Bearer ${token}`)
      .send(mockIngredient)
      .then(({ body: { ingredient } }) => {
        attMocks({ idIngredient: ingredient.id });
      });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct)
      .then((res) => {
        attMocks({ idProduct: res.body.product.id });
        return res;
      });

    expect(createProductResponse.status).toBe(201);
    expect(createProductResponse.body).toMatchObject({
      message: "Product created",
      product: {
        id: mockProduct.id,
        name: mockProduct.name.toLowerCase().trim(),
        price: mockProduct.price,
        calories: mockProduct.calories,
      },
    });
  });

  it("Should not be able to create a product without sending accessLevel 1 or 2", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

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

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        name: "Batatão recheado com cenoura",
        price: 4.99,
        calories: 300,
        ingredients: [{ id: mockIngredient.id, amount: "100" }],
        categories: [mockCategory.id],
      });

    expect(createProductResponse.status).toBe(401);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  it("Should not be able to create a product with repeated name", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct);

    expect(createProductResponse.status).toBe(409);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Product with this name already exists",
      })
    );
  });

  it("Should not be able to create a product with unexistent ingredient", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: [
          {
            id: mockProduct.id,
            amount: "100",
          },
        ],
        categories: mockProduct.categories,
      });

    expect(createProductResponse.status).toBe(400);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of ingredients ids",
      })
    );
  });

  it("Should not be able to create a product with unexistent category", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "Admin123",
    });

    const createProductResponse = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Batatão",
        price: 4.99,
        calories: 300,
        ingredients: mockProduct.ingredients,
        categories: [mockProduct.id],
      });

    expect(createProductResponse.status).toBe(400);
    expect(createProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Invalid list of categories ids",
      })
    );
  });
});
