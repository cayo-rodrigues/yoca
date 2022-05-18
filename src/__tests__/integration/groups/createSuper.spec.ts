import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import * as uuid from "uuid";
jest.mock("uuid");

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
    access_level: 1,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create a super", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const createSuperResponse = await request(app)
      .post("/super")
      .send(mockSuper);

    expect(createSuperResponse.status).toBe(201);
    expect(createSuperResponse.body).toEqual(
      expect.objectContaining({
        id: "some-uuid",
        access_level: 1,
      })
    );
  });
  it("Should not be able to create another super", async () => {
    const createSuperResponse = await request(app)
      .post("/super")
      .send(mockSuper);

    expect(createSuperResponse.status).toBe(409);
    expect(createSuperResponse.body).toEqual(
      expect.objectContaining({ message: "Super group already exists" })
    );
  });
});
