import { Router } from "express";
import express from "express";
const router = express.Router();

// application status
router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "The Blog Application is Running!!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error! Application not Running",
    });
  }
});

// db status
router.get("/db-status", async (req, res) => {
  const db = req.app.locals.db;
  if (!db) {
    throw new Error("Database not initialized");
  } else {
    res.status(200).json({
      message: "MongoDB connection is active",
      databaseName: db.databaseName,
    });
  }
});

// add a new blog
router.post("/new", async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate input: title and content are required
    if (!title || !content) {
      return res.status(400).json({
        message: "Validation Error: 'title' and 'content' are required.",
      });
    }

    const db = req.app.locals.db;
    const blogsCollection = db.collection("blogs");

    //define the query body
    const newBlog = {
      title,
      content,
      tags: tags || [], // Default tags to an empty array if not provided
      createdAt: new Date(),
      updatedAt: null,
    };

    // insert the data
    const result = await blogsCollection.insertOne(newBlog);
    res.status(201).json({
      message: "New blog created",
      blogId: result.insertedId,
      blog: newBlog,
    });
  } catch (err) {
    console.error("Error creating new blog:", err);
    res.status(500).json({
      message: "Failed to create blog",
      error: err.message,
    });
  }
});

export default router;
