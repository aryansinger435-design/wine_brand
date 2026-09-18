import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import wineRoutes from "./routes/wine.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { seedInitialWines } from "./controllers/wine.controller.js";

dotenv.config();

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Root health & status check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Château Dhariwal Luxury Wine Brand API is live",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      wines: "/api/wines",
    },
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/wines", wineRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Seed sample wines if database is fresh
  await seedInitialWines();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🍷 Château Dhariwal API running on http://localhost:${PORT}`);
    console.log(`🌐 Ready for frontend connection`);
    console.log(`======================================================\n`);
  });
});
