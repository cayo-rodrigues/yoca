import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" POST - /groups ", () => {
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

  it("Should be able to create a group", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });

    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);

    expect(createGroupResponse.status).toBe(201);
    expect(createGroupResponse.body).toEqual(
      expect.objectContaining({
        id: "some-uuid",
        access_level: 2,
      })
    );
  });
  it("Should not be able to create a group without sending access_level 1 or 2", async () => {
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
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`)
      .send(mockGroup);

    expect(createGroupResponse.status).toBe(401);
    expect(createGroupResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
