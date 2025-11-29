// Import the Mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Define the MongoDB connection URI, using an environment variable or a default local URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogs-db";

/**
 * @description Asynchronously connects to the MongoDB database using the defined URI.
 * Logs a success message on a successful connection or an error message and exits the process on a failed connection.
 */
async function DBconnect() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB via Mongoose!");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    // Exit the process with a failure code if the connection fails
    process.exit(1);
  }
}

// Export the DBconnect function to be used in other parts of the application
export default DBconnect;
