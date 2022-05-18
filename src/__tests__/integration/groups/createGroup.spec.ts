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
    access_level: 1,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to create a group", async () => {
    const uuidSpy = jest.spyOn(uuid, "v4");
    uuidSpy.mockReturnValue("some-uuid");

    const createGroupResponse = await request(app)
      .post("/groups")
      .send(mockGroup);

    expect(createGroupResponse.status).toBe(201);
    expect(createGroupResponse.body).toEqual(
      expect.objectContaining({
        id: "some-uuid",
        access_level: 1,
      })
    );
  });
});
