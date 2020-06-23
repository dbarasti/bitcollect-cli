const mongoose = require("mongoose");
const log = require('log-to-file');
require("dotenv/config");

const dbURI = process.env.CONNECTION_URI;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => {
  log("Mongoose connection error: " + err);
});

mongoose.connection.on("connected", () => {
  log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on("error", err => {
  log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
  log("Mongoose disconnected");
});

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});
process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown", () => {
    process.exit(0);
  });
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};