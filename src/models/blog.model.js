import mongoose from "mongoose";

//define the blog schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: [10, "Content must be at least 10 characters long"],
      trim: true,
    },
    tags: {
      type: [String],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
