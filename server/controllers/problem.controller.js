const Problem = require('../models/Problem');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getProblems = async (req, res, next) => {
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
    let query = Problem.find(JSON.parse(queryStr));

    // Handle search
    if (req.query.search) {
      // Create text index if not already created
      query = Problem.find({ $text: { $search: req.query.search } });
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
    const total = await Problem.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const problems = await query;

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
      count: problems.length,
      pagination,
      total,
      data: problems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Public
exports.getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return next(
        new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private (Admin only)
exports.createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);

    res.status(201).json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private (Admin only)
exports.updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!problem) {
      return next(
        new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private (Admin only)
exports.deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return next(
        new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
      );
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get problems by topic
// @route   GET /api/problems/topic/:topic
// @access  Public
exports.getProblemsByTopic = async (req, res, next) => {
  try {
    const { topic } = req.query;
    
    // Build the query
    const query = {};
    if (topic) {
      // Case-insensitive search for topics
      query.topic = { $regex: new RegExp(topic, 'i') };
    }
    
    console.log('Query:', query);
    
    // Find problems matching the query, limit to 45, sort by difficulty
    const problems = await Problem.find(query)
      .sort({ difficulty: 1, title: 1 })
      .limit(45)
      .lean();
    
    console.log(`Found ${problems.length} problems for topic: ${topic || 'all'}`);
    
    // Handle case where no problems are found
    if (problems.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (err) {
    console.error('Error getting problems by topic:', err);
    next(err);
  }
};

// @desc    Get problems by difficulty
// @route   GET /api/problems/difficulty/:difficulty
// @access  Public
exports.getProblemsByDifficulty = async (req, res, next) => {
  try {
    const problems = await Problem.find({ difficulty: req.params.difficulty });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (err) {
    next(err);
  }
}; 