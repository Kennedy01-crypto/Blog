import mongoose from "mongoose";

// Define the schema for the Blog model
const blogSchema = new mongoose.Schema(
  {
    // Title of the blog post
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [50, "Title cannot exceed 50 characters"],
      trim: true, // Trims whitespace from the beginning and end
    },
    // Content of the blog post
    content: {
      type: String,
      required: true,
      minlength: [10, "Content must be at least 10 characters long"],
      trim: true,
    },
    // Tags associated with the blog post
    tags: {
      type: [String],
      lowercase: true, // Converts tags to lowercase
      trim: true,
    },
    // Status of the blog post
    status: {
      type: String,
      enum: ["draft", "published", "archived"], // Allowed values for status
      default: "draft", // Default status is "draft"
    },
  },
  {
    // Enable automatic creation of `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create the Blog model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the Blog model
export default Blog;
