import "dotenv/config";
import { DataSource } from "typeorm";

const host = process.env.IS_COMPOSE ? "host.docker.internal" : "localhost";

const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: ["src/models/*.ts"],
        synchronize: true,
      })
    : new DataSource({
        type: "postgres",
        host,
        url: process.env.DB_URL,
        synchronize: false,
        logging: true,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
        entities:
          process.env.NODE_ENV === "production"
            ? ["dist/src/models/*.js"]
            : ["src/models/*.ts"],
        migrations:
          process.env.NODE_ENV === "production"
            ? ["dist/src/migrations/*.js"]
            : ["src/migrations/*.ts"],
        migrationsRun: true,
      });

export default AppDataSource;
