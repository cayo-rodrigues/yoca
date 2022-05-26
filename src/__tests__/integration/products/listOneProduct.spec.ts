import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /products/:id", () => {
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

  type ListProductResponse = {
    id: string;
    name: string;
    price: number;
    calories: number;
    createdAt: Date;
    updatedAt: Date;
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

  it("Should be able to list a product", async () => {
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

    const {
      body: { product: createdProduct },
    } = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(mockProduct)
      .then((res) => {
        attMocks({ idProduct: res.body.product.id });
        return res;
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

    createdProduct.price = createdProduct.price.toFixed(2);
    createdProduct.calories = createdProduct.calories.toFixed(2);

    const listOneProductResponse = await request(app)
      .get(`/products/${mockProduct.id}`)
      .set("Authorization", `Bearer ${employeeToken}`);

    expect(listOneProductResponse.status).toBe(200);
    expect(listOneProductResponse.body).toMatchObject({
      ...createdProduct,
    });
  });

  it("Should not be able to list a product that doesnt exists", async () => {
    await request(app).post("/super").send(mockSuperUser);

    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: mockSuperUser.email,
      password: mockSuperUser.password,
    });

    const listOneProductResponse = await request(app)
      .get(`/products/${mockIngredient.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(listOneProductResponse.status).toBe(404);
    expect(listOneProductResponse.body).toEqual(
      expect.objectContaining({
        message: "Product not found",
      })
    );
  });
});
