const Testimonial = require('../models/Testimonial');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!testimonial) {
      return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
    }
    
    await testimonial.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 