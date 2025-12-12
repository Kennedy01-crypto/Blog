import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      unique: [true, "Username must be unique."],
      lowercase: true,
      trim: true,
      minlength: [8, "Username must be at least 8 characters long."],
    },
    email: {
      type: String,
      required: [true, "An email is required."],
      unique: [true, "User with this email already exists"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    blogsPosted: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be lnger than 8 characters"],
      select: false,
    },
  },
  {
    // Ensure virtuals are included in toJSON and toObject outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual property to get the user's full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//Presave function to hash passsword
userSchema.pre("save", async function (next) {
  //check if hte pasword has been modified
  if (!this.isModified("password")) {
    return next;
  }
  try {
    //use a cost factor of 10
    //the salt is generated ad included in the hasg automatically
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

//Method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

//Method to generate JWT
//will be called on a user instance after succesfull login
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email, username: this.username }, //Payload: User ID, email and username
    process.env.JWT_SECRET, //secret kay from env variables
    {
      expiresIn: process.env.JWT_LIFETIME, //Token expiration time
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
