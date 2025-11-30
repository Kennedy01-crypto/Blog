import express from "express";
import * as blogsController from "../controllers/blogsController.js";
const router = express.Router();

// Route to create a new blog post
router.post("/", blogsController.createBlog);
router.get("/", blogsController.getBlogs);
router.get("/:id", blogsController.getBlog);
router.patch("/:id", blogsController.editBlog);
router.put("/:id", blogsController.editBlog);
router.delete("/:id", blogsController.deleteBlog);

export default router;
