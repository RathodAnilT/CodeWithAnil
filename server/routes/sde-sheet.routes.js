const express = require('express');
const {
  getSDESheetProblems,
  getUserProgress,
  updateProblemProgress,
  getBookmarkedProblems,
  createSDESheetProblem,
  updateSDESheetProblem,
  deleteProblemProgress,
  updateBookmark,
  updateNote
} = require('../controllers/sde-sheet.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.route('/problems').get(getSDESheetProblems);

// Protected routes
router.route('/progress').get(protect, getUserProgress);
router.route('/bookmarks').get(protect, getBookmarkedProblems);

// Progress routes - updated to match client expectations
router.route('/progress/:problemId')
  .put(protect, updateProblemProgress)
  .delete(protect, deleteProblemProgress);

// Add bookmark route
router.route('/progress/:problemId/bookmark')
  .put(protect, updateBookmark);

// Add note route
router.route('/progress/:problemId/note')
  .put(protect, updateNote);

// Admin routes
router.route('/')
  .post(protect, authorize('admin'), createSDESheetProblem);

router.route('/:id')
  .put(protect, authorize('admin'), updateSDESheetProblem);

module.exports = router; 