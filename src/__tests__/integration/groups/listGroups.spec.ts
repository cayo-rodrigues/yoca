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
    access_level: 1,
  };

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should be able to list all groups", async () => {
    const createGroupResponse = await request(app)
      .post("/groups")
      .send(mockGroup);
    const listGroupsResponse = await request(app).get("/groups");

    expect(listGroupsResponse.status).toBe(200);
    expect(listGroupsResponse.body).toHaveProperty("reduce");
    expect(listGroupsResponse.body).toEqual(
      expect.arrayContaining([createGroupResponse.body])
    );
  });
  it("Should not be able to list groups without auth", async () => {
    const createGroupResponse = await request(app)
      .post("/groups")
      .send(mockGroup);
    const listGroupsResponse = await request(app).get("/groups");

    expect(listGroupsResponse.status).toBe(401);
    expect(listGroupsResponse.body).toEqual(
      expect.objectContaining({ message: "Unauthorized" })
    );
  });
});
