import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";
import { TESTS_PASSWORD } from "../../../../utils";

type GenProductResponse = {
  message: string;
  feedback: {
    description: string;
    rating: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

describe("POST - /feedbacks/products", () => {
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

  it("Should be able to create an product feedback", async () => {
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

    const productFeedbackResponse = await request(app)
      .post("/feedbacks/products")
      .send({
        description: "A pizza estava perfeita!",
        rating: 5,
        productId: productResponse.body.product.id,
      });

    expect(productFeedbackResponse.status).toBe(201);
    expect(productFeedbackResponse.body).toMatchObject<GenProductResponse>({
      message: "Product feedback created",
      feedback: {
        ...productFeedbackResponse.body.feedback,
        description: "A pizza estava perfeita!",
        rating: 5,
      },
    });
  });
});
