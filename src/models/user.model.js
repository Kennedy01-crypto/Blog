import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [8, "Username must be at least 8 characters long."],
    },
    email: {
      type: String,
      required: [true, "An email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    blogsPosted: {
      type: Number,
      default: 0,
    },
  },
  {
    // Ensure virtuals are included in toJSON and toObject outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to get the user's full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
