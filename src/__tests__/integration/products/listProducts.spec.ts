import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { clearDB } from "../../connection";

describe(" GET - /products ", () => {
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

  afterEach(async ()=>{
    await clearDB(connection);
  })

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all products", async () => {
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

    const ingredientResponse = await request(app)
      .post("/ingredients")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockIngredient);

    await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "massas",
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
            ingredientId: ingredientResponse.body.ingredient.id,
            amount: "100",
          },
        ],
        categories: ["massas"],
      });
    const listProductsResponse = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listProductsResponse.status).toBe(200);
    expect(listProductsResponse.body).toHaveProperty("reduce");
    expect(listProductsResponse.body).toEqual(
      expect.arrayContaining([createProductResponse.body.product])
    );
  });

  it("Should not be able to list products without sending accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin123",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: "12345678",
        accessLevel: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "12345678",
    });

    const listProductsResponse = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(listProductsResponse.status).toBe(401);
    expect(listProductsResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
