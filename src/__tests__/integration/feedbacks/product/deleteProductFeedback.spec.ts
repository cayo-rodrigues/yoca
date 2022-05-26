import { DataSource } from "typeorm";
import AppDataSource from "../../../../data-source";
import app from "../../../../app";
import request from "supertest";
import { TESTS_PASSWORD } from "../../../../utils";

describe("DELETE - /feedbacks/products/:id", () => {
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

  it("Should be able to delete one product feedback", async () => {
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

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/products")
      .send({
        description: "A pizza estava perfeita!",
        rating: 5,
        productId: productResponse.body.product.id,
      });

    const deleteProdFeedback = await request(app)
      .delete(`/feedbacks/products/${prodFeedbackResponse.body.feedback.id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteProdFeedback.status).toBe(204);
    expect(deleteProdFeedback.body).toEqual({});
    expect(
      (
        await request(app)
          .delete(
            `/feedbacks/products/${prodFeedbackResponse.body.feedback.id}`
          )
          .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      ).status
    ).toBe(404);
  });
  it("Should not be able to delete one product feedback without accessLevel 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const withoutAccessResponse = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "999999999999",
        password: TESTS_PASSWORD,
        accessLevel: 4,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: TESTS_PASSWORD,
    });

    const listProductsResponse = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const prodFeedbackResponse = await request(app)
      .post("/feedbacks/products")
      .send({
        description: "A pizza estava perfeita!",
        rating: 5,
        productId: listProductsResponse.body.results[0].id,
      });

    const deleteProdFeedback = await request(app)
      .delete(`/feedbacks/products/${prodFeedbackResponse.body.feedback.id}`)
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(deleteProdFeedback.status).toBe(401);
    expect(deleteProdFeedback.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });
  it("Should not be able to delete one product feedback sending unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: TESTS_PASSWORD,
    });

    const deleteProdFeedback = await request(app)
      .delete("/feedbacks/products/5cee5a5f-169d-423b-8c48-64d27d2c59ed")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(deleteProdFeedback.status).toBe(404);
    expect(deleteProdFeedback.body).toEqual(
      expect.objectContaining({
        message: "Product feedback not found",
      })
    );
  });
});
