import AppError from "../config/appError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const resgisterUser = async (req, res, next) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("user with this email already exists", 409));
    }

    //Create a new User
    const newUser = await User.create({
      email,
      password,
      username,
      firstName,
      lastName,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        userId: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastname: newUser.lastName,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Basic input validation
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    //find User by email
    //explicitly select the password because we set select: false in the schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      //return a generic message for security reasons
      //this prevents attackers from knoing if an email exists in the system
      return next(new AppError("Invalid email or password", 401)); // unauthorized
    }

    //compare provided password with the jashed password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      //return a generic error
      return next(new AppError("Invalid email or password", 401)); //unauthorized
    }

    //generate JWT
    const token = user.createJWT();

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
