const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit code for execution
// @route   POST /api/submissions
// @access  Private
exports.submitCode = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return next(
        new ErrorResponse(`Problem not found with id of ${problemId}`, 404)
      );
    }

    // Create submission record
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status: 'pending'
    });

    // In a real-world scenario, here we would send the code to a code execution service
    // For now, we'll simulate a successful execution
    submission.status = 'accepted';
    submission.executionTime = Math.floor(Math.random() * 100) + 1; // Random time between 1-100ms
    submission.memoryUsage = Math.floor(Math.random() * 1000) + 100; // Random memory between 100-1100KB
    submission.output = 'Execution successful';
    
    await submission.save();

    // If submission is successful, mark problem as solved for the user
    if (submission.status === 'accepted') {
      const user = await User.findById(req.user.id);
      await user.addSolvedProblem(problemId);
    }

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all submissions for current user
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res, next) => {
  try {
    // Allow filtering by problem
    const filter = { user: req.user.id };
    if (req.query.problem) {
      filter.problem = req.query.problem;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'problem',
        select: 'title difficulty'
      });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate({
      path: 'problem',
      select: 'title difficulty'
    });

    if (!submission) {
      return next(
        new ErrorResponse(`Submission not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the submission or is admin
    if (
      submission.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this submission`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return next(
        new ErrorResponse(`Submission not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user owns the submission or is admin
    if (
      submission.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this submission`,
          403
        )
      );
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 