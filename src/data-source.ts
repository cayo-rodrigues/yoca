import "dotenv/config";
import { DataSource } from "typeorm";

const AppDataSource =
  process.env.NODE_ENV === "test"
    ? new DataSource({
        type: "sqlite",
        database: ":memory:",
        entities: ["src/entities/*.ts"],
        synchronize: true,
      })
    : new DataSource({
        type: "postgres",
        url: process.env.DB_URL,
        synchronize: false,
        logging: true,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
        entities:
          process.env.NODE_ENV === "production"
            ? ["dist/models/*.js"]
            : ["src/models/*.ts"],
        migrations:
          process.env.NODE_ENV === "production"
            ? ["dist/migrations/*.js"]
            : ["src/migrations/*.ts"],
        migrationsRun: true,
      });

export default AppDataSource;
