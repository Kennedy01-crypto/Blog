// Import necessary modules
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import DBconnect from "./config/db.js";
import blogsrouter from "./routes/blogRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./config/appError.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig.js";

// Load environment variables from a .env file into process.env
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port for the server, using an environment variable or a default value
const PORT = process.env.PORT || 3000;

// Use morgan for HTTP request logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to parse incoming JSON requests
app.use(express.json());

// Establish a connection to the database
DBconnect();

//Swagger Documentaion Setip
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅TaskFlow API is running!" });
});

// Mount the blogs router for all routes starting with /api
app.use("/api/blogs", blogsrouter);

// Middleware to handle requests for routes that have not been defined
app.use("/*path", (req, res, next) => {
  // Pass a 404 error to the global error handler
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware to catch and process all errors
app.use(globalErrorHandler);

// Start the server and listen for incoming requests on the specified port
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown for uncaught exceptions

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);

  // Close the server and exit the process
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed. Exiting process.");

    process.exit(1);
  });
});

// Graceful shutdown for unhandled promise rejections

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);

  // Close the server and exit the process
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(1);
  });
});
