const User = require('../models/User');
const Blog = require('../models/Blog');
const Problem = require('../models/Problem');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    // Only allow certain fields to be updated
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's activity
// @route   GET /api/users/activity
// @access  Private
exports.getUserActivity = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.user.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user.activity
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add problem to user's solved list
// @route   POST /api/users/problems/:problemId/solved
// @access  Private
exports.markProblemSolved = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problemId);

    if (!problem) {
      return next(
        new ErrorResponse(`Problem not found with id of ${req.params.problemId}`, 404)
      );
    }

    const user = await User.findById(req.user.id);
    
    // Add problem to solved list and update activity
    await user.addSolvedProblem(req.params.problemId, req.body.source || 'leetcode');

    res.status(200).json({
      success: true,
      message: 'Problem marked as solved'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's solved problems
// @route   GET /api/users/problems/solved
// @access  Private
exports.getSolvedProblems = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'solvedProblems.problemId',
      select: 'title topic difficulty'
    });

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.user.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      count: user.solvedProblems.length,
      data: user.solvedProblems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bookmark a blog or problem
// @route   POST /api/users/bookmarks
// @access  Private
exports.addBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body;

    if (!['blog', 'problem'].includes(itemType)) {
      return next(
        new ErrorResponse('Invalid item type. Must be "blog" or "problem"', 400)
      );
    }

    // Verify that the item exists
    let item;
    if (itemType === 'blog') {
      item = await Blog.findById(itemId);
    } else {
      item = await Problem.findById(itemId);
    }

    if (!item) {
      return next(
        new ErrorResponse(`${itemType} not found with id of ${itemId}`, 404)
      );
    }

    // Check if already bookmarked
    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.some(
      bookmark => bookmark.itemType === itemType && bookmark.itemId.toString() === itemId
    );

    if (alreadyBookmarked) {
      return next(
        new ErrorResponse(`${itemType} already bookmarked`, 400)
      );
    }

    // Add bookmark
    user.bookmarks.push({
      itemType,
      itemId
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: `${itemType} bookmarked successfully`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/users/bookmarks/:bookmarkId
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Find bookmark
    const bookmark = user.bookmarks.id(req.params.bookmarkId);

    if (!bookmark) {
      return next(
        new ErrorResponse(`Bookmark not found with id of ${req.params.bookmarkId}`, 404)
      );
    }

    // Remove bookmark
    bookmark.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Filter by type if specified
    const { type } = req.query;
    let bookmarks = user.bookmarks;

    if (type && ['blog', 'problem'].includes(type)) {
      bookmarks = bookmarks.filter(bookmark => bookmark.itemType === type);
    }

    // Populate the actual items
    const populatedBookmarks = [];

    for (const bookmark of bookmarks) {
      let item;
      if (bookmark.itemType === 'blog') {
        item = await Blog.findById(bookmark.itemId).select('title author createdAt');
        if (item) {
          populatedBookmarks.push({
            _id: bookmark._id,
            itemType: bookmark.itemType,
            addedAt: bookmark.addedAt,
            item
          });
        }
      } else {
        item = await Problem.findById(bookmark.itemId).select('title difficulty topic');
        if (item) {
          populatedBookmarks.push({
            _id: bookmark._id,
            itemType: bookmark.itemType,
            addedAt: bookmark.addedAt,
            item
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: populatedBookmarks.length,
      data: populatedBookmarks
    });
  } catch (err) {
    next(err);
  }
}; 