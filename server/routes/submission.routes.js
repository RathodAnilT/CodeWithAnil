const express = require('express');
const {
  submitCode,
  getSubmissions,
  getSubmission,
  deleteSubmission
} = require('../controllers/submission.controller');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Submission routes
router.route('/')
  .get(getSubmissions)
  .post(submitCode);

router.route('/:id')
  .get(getSubmission)
  .delete(deleteSubmission);

module.exports = router; 