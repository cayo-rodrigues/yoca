import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" DELETE - /products/:id ", () => {
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

  it("Should be able to delete an existing product", async () => {
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

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct)
      .then((res) => {
        attMocks({ idProduct: res.body.product.id });
        return res;
      });

    const delProductResponse = await request(app)
      .delete(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(delProductResponse.status).toBe(204);
    expect(delProductResponse.body).toEqual({});
    expect(
      (
        await request(app)
          .delete(`/products/${mockProduct.id}`)
          .set("Authorization", `Bearer ${token}`)
      ).status
    ).toBe(404);
  });

  it("Should not be able to delete an existing product without sending accessLevel 1 or 2", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct)
      .then(({ body: { product } }) => {
        attMocks({ idProduct: product.id });
      });

    await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${token}`)
      .send(mockEmployee);

    const {
      body: { token: employeeToken },
    } = await request(app).post("/sessions").send({
      email: mockEmployee.email,
      password: mockEmployee.password,
    });

    const delProductResponse = await request(app)
      .delete(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(delProductResponse.status).toBe(401);
    expect(delProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
});
