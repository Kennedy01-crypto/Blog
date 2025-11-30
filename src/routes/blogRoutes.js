import express from "express";
import * as blogsController from "../controllers/blogsController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API for managing blog posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Blog:
 *          type: object
 *          required:
 *             - author
 *             - title
 *             - content
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the blog post
 *              author:
 *                  type: string
 *                  description: The author of the blog post
 *              title:
 *                  type: string
 *                  description: The title of the blog post
 *              content:
 *                  type: string
 *                  description: The content of the blog post
 *              tags:
 *                  type: array
 *                  items:
 *                      type: string
 *                  description: Tags associated with the blog post
 *              status:
 *                  type: string
 *                  description: The status of the blog post
 *                  enum: [draft, published, archived]
 *                  default: draft
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: The date the blog post was created
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: The date the blog post was last updated
 *          example:
 *              id: 60d0fe4f5311236168a109ca
 *              author: "John Doe"
 *              title: "My First Blog Post"
 *              content: "This is the content of my first blog post."
 *              tags: ["new", "tech"]
 *              status: "published"
 *              createdAt: "2023-01-01T12:00:00.000Z"
 *              updatedAt: "2023-01-01T12:00:00.000Z"
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: The blog post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Some server error
 */
router.post("/", blogsController.createBlog);

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Returns the list of all the blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: The list of the blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get("/", blogsController.getBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get the blog post by id
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog post id
 *     responses:
 *       200:
 *         description: The blog post description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The blog post was not found
 */
router.get("/:id", blogsController.getBlog);

/**
 * @swagger
 * /blogs/{id}:
 *  patch:
 *    summary: Update the blog post by the id
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The blog post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *    responses:
 *      200:
 *        description: The blog post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      404:
 *        description: The blog post was not found
 *      500:
 *        description: Some error happened
 */
router.patch("/:id", blogsController.editBlog);

/**
 * @swagger
 * /blogs/{id}:
 *  put:
 *    summary: Update the blog post by the id
 *    tags: [Blogs]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The blog post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Blog'
 *    responses:
 *      200:
 *        description: The blog post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Blog'
 *      404:
 *        description: The blog post was not found
 *      500:
 *        description: Some error happened
 */
router.put("/:id", blogsController.editBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Remove the blog post by id
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog post id
 *     responses:
 *       204:
 *         description: The blog post was deleted
 *       404:
 *         description: The blog post was not found
 */
router.delete("/:id", blogsController.deleteBlog);

export default router;
