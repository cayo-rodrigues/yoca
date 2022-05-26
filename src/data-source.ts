import "dotenv/config";
import { DataSource } from "typeorm";

const host = process.env.IS_COMPOSE ? "host.docker.internal" : "localhost";

const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "postgres",
        username: process.env.DB_USER,
        host,
        database: process.env.DB_TESTS,
        password: process.env.DB_PASSWORD,
        port: 16543,
        entities: ["src/models/*.ts"],
        migrations: ["src/migrations/*.ts"],
        migrationsRun: true,
        dropSchema: true,
      })
    : new DataSource({
        type: "postgres",
        host,
        url:
          process.env.NODE_ENV === "production"
            ? process.env.DATABASE_URL
            : process.env.DB_URL,
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
      });

export default AppDataSource;
