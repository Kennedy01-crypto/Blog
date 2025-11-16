import express from "express";
import DBconnect from "./config/db.js";
import blogsrouter from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

DBconnect();


// middleware
app.use(express.json());

// Retruve all users
app.get("/users", (req, res) => {
  if (users.length === 0) {
    return res.status(404).send("No users found.");
  } else {
    res.json(users);
  }
});

// Retrieve a user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.userId === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("The user with the given ID was not found.");
  } else {
    res.json(user);
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const newUser = {
    userId: users.length > 0 ? Math.max(...users.map((u) => u.userId)) + 1 : 1,
    name: req.body.name,
  };
  users.push(newUser);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataFilePath = path.join(__dirname, "data.js");
  const updatedData = `export let users = ${JSON.stringify(
    users,
    null,
    2
  )}; export let blogs = ${JSON.stringify(blogs, null, 2)};`;
  //write the new data back to data.js
  fs.writeFile(dataFilePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("An error occurred while writing to the file.");
    }
    res.status(201).json(newUser);
  });
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.userId === parseInt(req.params.id));
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  user.name = req.body.name;
  res.json(user);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex(
    (u) => u.userId === parseInt(req.params.id)
  );
  if (userIndex === -1)
    return res.status(404).send("The user with the given ID was not found.");

  const deletedUSer = users.splice(userIndex, 1);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataFilePath = path.join(__dirname, "data.js");
  const updatedData = `export let users = ${JSON.stringify(users, null, 2)};

export let blogs = ${JSON.stringify(blogs, null, 2)};`;

  fs.writeFile(dataFilePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("An error occurred while writing to the file.");
    }
    res.json(deletedUSer);
  });
});

// Blogs API
app.use("/api", blogsrouter);

// connect to the DB and start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});

// DBconnect()
//   .then((client) => {
//     console.log(`✅ Connected to MongoDB`);

//     //set the db object for the whole application
//     app.locals.db = client.db("blogs-db");

//     //app lisener
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//       console.log(`Access the Blog Application at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => console.error(`❌ MongoDB connection error: ${err}`));
