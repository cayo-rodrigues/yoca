import app from "./app";
import AppDataSource from "./data-source";

(async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log("\nData source initiliazed");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () =>
    console.log(`\nRunning at http://localhost:${PORT}\n`)
  );
})();
