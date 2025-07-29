const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  deleteComment
} = require('../controllers/blog.controller');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Blog routes
router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

// Like/unlike routes
router.route('/:id/like').put(protect, likeBlog);
router.route('/:id/unlike').put(protect, unlikeBlog);

// Comment routes
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/comments/:commentId').delete(protect, deleteComment);

module.exports = router; 