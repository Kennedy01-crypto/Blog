import mongoose from "mongoose";

// Define the schema for the Blog model
const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A blog post must have an author."],
    },
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
    // Reading time in minutes
    readingTime: {
      type: Number,
      default: 0,
    },
    // Number of views
    viewCount: {
      type: Number,
      default: 0,
    },
    // Status of the blog post
    status: {
      type: String,
      enum: ["draft", "published", "archived"], // Allowed values for status
      default: "draft", // Default status is "draft"
    },
    //Likes & dislikes
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    //comments
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId, //TODO: Create a separate Comment Model
        ref: "Comment",
      },
    ],
  },
  {
    // Enable automatic creation of `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Pre-save middleware to calculate reading time
blogSchema.pre("save", function (next) {
  if (this.isModified("content") || this.isNew) {
    const wordCount = this.content.trim().split(/\s+/).length;
    const readingSpeed = 200; // Words per minute
    this.readingTime = Math.ceil(wordCount / readingSpeed);
  }
  next();
});

// Static method to increment view count
blogSchema.statics.incrementViewCount = function (blogId) {
  return this.findByIdAndUpdate(
    blogId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

// Create the Blog model from the schema
const Blog = mongoose.model("Blog", blogSchema);

// Export the Blog model
export default Blog;
