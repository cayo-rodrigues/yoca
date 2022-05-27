import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" POST - /super ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockSuper = {
    name: "testaurant",
    email: "admin@email.com",
    phone: "999999999999",
    password: "S3nh@F0rt3",
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create a super", async () => {
    const createSuperResponse = await request(app)
      .post("/super")
      .send(mockSuper);

    expect(createSuperResponse.status).toBe(201);
    expect(createSuperResponse.body).toMatchObject({
      message: "Super user created",
      superUser: {
        name: "testaurant",
        email: "admin@email.com",
        phone: "999999999999",
        accessLevel: 1,
      },
    });
  });
  it("Should not be able to create another super", async () => {
    const createSuperResponse = await request(app)
      .post("/super")
      .send(mockSuper);

    expect(createSuperResponse.status).toBe(409);
    expect(createSuperResponse.body).toEqual(
      expect.objectContaining({
        message: "Super user has to be created before other users",
      })
    );
  });
});
