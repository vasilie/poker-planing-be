module.exports = {
  apps: [
    {
      name: "Poker planning app",
      exec_mode: "cluster",
      instances: "1",
      script: "./app.js", // your script
      args: "start",
      env: {
        NODE_ENV: "production", 
      },
    },
  ],
};