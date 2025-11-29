import express from "express";
import * as blogsController from "../controllers/blogsController.js";
const router = express.Router();

// Route to create a new blog post
router.post("/", blogsController.createBlog);
router.get("/", blogsController.getBlogs);

export default router;
