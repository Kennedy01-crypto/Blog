import User from "../models/user.model.js";
import AppError from "../config/appError.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next();
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError(`No User found with that ID`, 404));
    }

    res.status(200).json({
      status: true,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};



// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
