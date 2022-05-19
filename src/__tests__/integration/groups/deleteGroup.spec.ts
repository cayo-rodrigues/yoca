import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

describe(" DELETE - /groups/:id ", () => {
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

  it("Should be able to delete a group", async () => {
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

    const delGroupResponse = await request(app)
      .delete("/groups/some-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delGroupResponse.status).toBe(204);
    expect(delGroupResponse.body).toHaveLength(0);
    expect((await request(app).delete("/groups/some-uuid")).status).toBe(404);
  });
  it("Should not be able to delete a group without sending access_level 1 or 2", async () => {
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
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);

    const delGroupResponse = await request(app)
      .delete("/groups/some-uuid")
      .set("Authorization", `Bearer ${withoutAccessLogin.body.token}`);

    expect(delGroupResponse.status).toBe(401);
    expect(delGroupResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
  it("Should not be able to delete a group without id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });
    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);
    const delGroupResponse = await request(app)
      .delete("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delGroupResponse.status).toBe(400);
    expect(delGroupResponse.body).toEqual(
      expect.objectContaining({ message: "Missing params id" })
    );
  });
  it("Should not be able to delete a group with unexistent id", async () => {
    const adminLoginResponse = await request(app).post("/sessions").send({
      email: "admin@email.com",
      password: "admin",
    });
    const createGroupResponse = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(mockGroup);

    const delGroupResponse = await request(app)
      .delete("/groups/some-aleatory-uuid")
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(delGroupResponse.status).toBe(404);
    expect(delGroupResponse.body).toEqual(
      expect.objectContaining({ message: "Group not found" })
    );
  });
});
