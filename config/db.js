// database configuration
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blogs-db";

// connect to the database
async function DBconnect() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  //test the connection
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged Deployment Success!!");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1);
  }
}

//export the connection function
export default DBconnect;
