import Blog from "../models/blog.model.js";
import AppError from "../config/appError.js";

/**
 * @desc Create a new blog
 * @route POST/api/blogs
 * @access Public
 */
export const createBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      data: { Blog: newBlog },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get blogs by id
 * @route GET/api/blogs/:id
 * @access Public
 */
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new AppError(`No Blog found with that ID`, 404));
    }

    res.status(200).json({
      status: true,
      data: {
        blog,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get all blogs
 * @route GET/api/blogs
 * @access Public
 */
export const getBlogs = async (req, res, next) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 1B) Advanced filtering
    //for eaxmple if URL: ?createdAt[gte]=2025-11-28
    let queryStr = JSON.stringify(queryObject); //convert the req.query into a string e.g '{"createdAt":{"gte":"2025-11-28"}}'
    //.replace(): The replace function finds "gte" and prepends a $ to it: '{"createdAt":{"$gte":"2025-11-28"}}'
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // Convert date strings to Date objects for date fields
    if (parsedQuery.createdAt) {
      for (const operator in parsedQuery.createdAt) {
        parsedQuery.createdAt[operator] = new Date(
          parsedQuery.createdAt[operator]
        );
      }
    }
    if (parsedQuery.updatedAt) {
      for (const operator in parsedQuery.updatedAt) {
        parsedQuery.updatedAt[operator] = new Date(
          parsedQuery.updatedAt[operator]
        );
      }
    }

    let query = Blog.find(parsedQuery); //change back to an object for mongoose to run a find() query

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const numBlogs = await Blog.countDocuments(parsedQuery);
    if (req.query.page) {
      if (skip >= numBlogs) throw new Error("This page does not exist");
    }
    // EXECUTE QUERY
    const blogs = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: true,
      results: blogs.length,
      total: numBlogs,
      count: blogs.length,
      pagination: {
        TotalBlogs: numBlogs,
        totalPages: Math.ceil(numBlogs / limit),
        currentPage: page,
        Limit: limit,
      },
      data: {
        blogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Edit a blog
 * @route PATCH /api/blogs/:id
 * @route PUT /api/blogs/:id
 * @access Public
 */
export const editBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!newBlog) {
      return next(new AppError(`No Blog found with that ID`, 404));
    }
    res.status(200).json({
      status: true,
      message: "Blog Successfully Edited",
      data: {
        blog: newBlog,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Delete Blog
 * @route DELETE /api/blogs/:Id
 * @access Public
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return next(new AppError(`No Blog found with that ID`, 404));
    }

    res.status(204).json({
      status: true,
      data: null,
      message: "Blog Successfully Deleted",
    });
  } catch (err) {
    next(err);
  }
};
