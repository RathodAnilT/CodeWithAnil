const Blog = require('../models/Blog');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resources
    let query = Blog.find(JSON.parse(queryStr)).populate({
      path: 'author',
      select: 'name'
    });

    // Handle search
    if (req.query.search) {
      query = Blog.find({ $text: { $search: req.query.search } }).populate({
        path: 'author',
        select: 'name'
      });
    }

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const blogs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      total,
      data: blogs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: 'author',
      select: 'name'
    });

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    const blog = await Blog.create(req.body);

    // Add blog to user's blogPosts array
    await User.findByIdAndUpdate(req.user.id, 
      { $push: { blogPosts: blog._id } }, 
      { new: true }
    );

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is blog owner or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to update this blog`, 403)
      );
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is blog owner or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this blog`, 403)
      );
    }

    await blog.deleteOne();

    // Remove blog from user's blogPosts array
    await User.findByIdAndUpdate(blog.author, 
      { $pull: { blogPosts: blog._id } }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if already liked by this user
    if (blog.likes.includes(req.user.id)) {
      return next(
        new ErrorResponse('Blog already liked by this user', 400)
      );
    }

    await Blog.findByIdAndUpdate(
      req.params.id,
      { $push: { likes: req.user.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Blog liked'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a blog
// @route   PUT /api/blogs/:id/unlike
// @access  Private
exports.unlikeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if not liked by this user
    if (!blog.likes.includes(req.user.id)) {
      return next(
        new ErrorResponse('Blog not liked by this user yet', 400)
      );
    }

    await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Blog unliked'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    const comment = {
      text: req.body.text,
      user: req.user.id
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({
      success: true,
      data: blog.comments[blog.comments.length - 1]
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment from blog
// @route   DELETE /api/blogs/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(
        new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
      );
    }

    // Get comment index
    const comment = blog.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return next(
        new ErrorResponse(`Comment not found with id of ${req.params.commentId}`, 404)
      );
    }

    // Make sure user is comment owner or admin or blog owner
    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      blog.author.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse('Not authorized to delete this comment', 403)
      );
    }

    // Find comment index to remove
    const removeIndex = blog.comments
      .map(comment => comment._id.toString())
      .indexOf(req.params.commentId);

    // Remove comment
    blog.comments.splice(removeIndex, 1);
    await blog.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 