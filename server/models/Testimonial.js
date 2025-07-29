const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  role: {
    type: String,
    required: [true, 'Please add a role or position']
  },
  image: {
    type: String,
    default: 'default-avatar.jpg'
  },
  content: {
    type: String,
    required: [true, 'Please add testimonial content'],
    maxlength: [500, 'Testimonial content cannot be more than 500 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema); 