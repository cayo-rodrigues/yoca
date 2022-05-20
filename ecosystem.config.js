module.exports = {
  apps: [
    {
      name: "yoca",
      script: "./dist/src/server.js",
      instances: "max",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
