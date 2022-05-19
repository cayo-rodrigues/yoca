import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

describe(" GET - /groups ", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  const mockGroup = {
    access_level: 2,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all groups", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });
    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);
    const listGroupsResponse = await request(app)
      .get("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(listGroupsResponse.status).toBe(200);
    expect(listGroupsResponse.body).toHaveProperty("reduce");
    expect(listGroupsResponse.body).toEqual(
      expect.arrayContaining([createGroupResponse.body])
    );
  });
  it("Should not be able to list groups without sending access_level 1 or 2", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const withoutAccessUser = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send({
        name: "John doe",
        email: "johndoe@email.com",
        phone: "4002-8922",
        password: "123456",
        access_level: 3,
      });

    const withoutAccessLogin = await request(app).post("/sessions").send({
      email: "johndoe@email.com",
      password: "123456",
    });

    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);

    const listGroupsResponse = await request(app)
      .get("/groups")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(listGroupsResponse.status).toBe(401);
    expect(listGroupsResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
