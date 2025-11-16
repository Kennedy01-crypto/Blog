// database configuration
import mongoose  from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogs-db";

// connect to the database
async function DBconnect() {

  try {
    await mongoose.connect(uri)
    console.log("✅ Connected to MongoDB via Mongoose!");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

//export the connection function
export default DBconnect;
