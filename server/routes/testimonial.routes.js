const express = require('express');
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonial.controller');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.route('/').get(getTestimonials);
router.route('/:id').get(getTestimonial);

// Protected routes
router.route('/').post(protect, authorize('admin'), createTestimonial);
router.route('/:id')
  .put(protect, authorize('admin'), updateTestimonial)
  .delete(protect, authorize('admin'), deleteTestimonial);

module.exports = router; 