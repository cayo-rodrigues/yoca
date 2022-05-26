import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /products ", () => {
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

  it("Should be able to list all products", async () => {
    await request(app).post("/super").send(mockSuperUser);

    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${token}`)
      .send(mockIngredient)
      .then(({ body: { ingredient } }) => {
        attMocks({ idIngredient: ingredient.id });
      });

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(mockCategory)
      .then(({ body: { category } }) => {
        attMocks({ idCategory: category.id });
      });

    const {
      body: { product },
    } = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct);

    const allProductsCreated = [product];

    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: mockProduct.name + i,
          price: mockProduct.price,
          calories: mockProduct.calories,
          ingredients: mockProduct.ingredients,
          categories: mockProduct.categories,
        })
        .then(({ body: { product } }) => {
          allProductsCreated.push(product);
        });
    }

    const listProductsResponse = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`);

    expect(listProductsResponse.status).toBe(200);
    expect(listProductsResponse.body).toHaveProperty("reduce");
    expect(listProductsResponse.body).toHaveLength(6);
  });

  it("Should not be able to list products without sending a token", async () => {
    const listProductsResponse = await request(app).get("/products");

    expect(listProductsResponse.status).toBe(401);
    expect(listProductsResponse.body).toEqual(
      expect.objectContaining({ message: "Missing authorization headers" })
    );
  });
});
