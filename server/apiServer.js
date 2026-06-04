require("dotenv").config({ quiet: true });

// Deployment-ready API update by Gabriel Balbuena (12292617).
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const carsRouter = require("./routes/cars");
const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;

if (!DB) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET environment variable.");
  process.exit(1);
}

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "CarGo API" });
});

app.use(authRouter);
app.use(carsRouter);
app.use(bookingsRouter);
app.use(express.static(path.join(__dirname, "../client")));

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("MongoDB connected");
    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

function startServer() {
  if (process.env.HTTPS_ENABLED === "true") {
    const keyPath = process.env.SSL_KEY_PATH;
    const certPath = process.env.SSL_CERT_PATH;

    if (!keyPath || !certPath || !fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.error("HTTPS is enabled but SSL_KEY_PATH or SSL_CERT_PATH is invalid.");
      process.exit(1);
    }

    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };

    https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
      console.log(`HTTPS server is running on port ${PORT}`);
    });
    return;
  }

  http.createServer(app).listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server is running on port ${PORT}`);
  });
}
