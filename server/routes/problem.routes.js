const express = require('express');
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByTopic,
  getProblemsByDifficulty
} = require('../controllers/problem.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Routes for problems
router.route('/')
  .get(getProblems)
  .post(protect, authorize('admin'), createProblem);

router.route('/:id')
  .get(getProblem)
  .put(protect, authorize('admin'), updateProblem)
  .delete(protect, authorize('admin'), deleteProblem);

// Topic and difficulty routes
router.route('/topic/:topic').get(getProblemsByTopic);
router.route('/difficulty/:difficulty').get(getProblemsByDifficulty);

// Get problems by topic, limited to 45
router.get('/problems', getProblemsByTopic);

module.exports = router; 