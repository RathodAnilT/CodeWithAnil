const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
  getUserActivity,
  markProblemSolved,
  getSolvedProblems,
  addBookmark,
  removeBookmark,
  getBookmarks
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

// Routes for admin only
router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Profile routes
router.route('/profile')
  .put(updateProfile);

// Activity routes
router.route('/activity')
  .get(getUserActivity);

// Problem solving routes
router.route('/problems/solved')
  .get(getSolvedProblems);

router.route('/problems/:problemId/solved')
  .post(markProblemSolved);

// Bookmark routes
router.route('/bookmarks')
  .get(getBookmarks)
  .post(addBookmark);

router.route('/bookmarks/:bookmarkId')
  .delete(removeBookmark);

module.exports = router; 