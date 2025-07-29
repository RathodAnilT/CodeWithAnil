const mongoose = require('mongoose');

const SDESheetProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Arrays',
      'Strings',
      'Linked List',
      'Stack & Queue',
      'Binary Search',
      'Trees',
      'Graphs',
      'Dynamic Programming',
      'Greedy',
      'Recursion & Backtracking',
      'Bit Manipulation',
      'Heaps',
      'Trie',
      'Two Pointers',
      'Sliding Window',
      'Hashing',
      'Mathematics'
    ]
  },
  difficulty: {
    type: String,
    required: [true, 'Please provide a difficulty level'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  leetCodeLink: {
    type: String,
    required: [true, 'Please provide a LeetCode link'],
    match: [
      /^https?:\/\/leetcode\.com\/problems\/[a-zA-Z0-9-]+\/?$/,
      'Please provide a valid LeetCode URL'
    ]
  },
  gfgLink: {
    type: String,
    match: [
      /^https?:\/\/practice\.geeksforgeeks\.org\/problems\/[a-zA-Z0-9-]+\/?$/,
      'Please provide a valid GeeksforGeeks URL'
    ]
  },
  order: {
    type: Number,
    required: [true, 'Please provide an order for this problem']
  },
  sheet: {
    type: String,
    required: [true, 'Please specify which sheet this problem belongs to'],
    enum: ['dsa', 'sde', 'faang', 'interview'],
    default: 'sde'
  },
  section: {
    type: String,
    required: [true, 'Please specify which section this problem belongs to']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster lookups
SDESheetProblemSchema.index({ sheet: 1, section: 1, order: 1 });
SDESheetProblemSchema.index({ category: 1, difficulty: 1 });
SDESheetProblemSchema.index({ title: 'text' });

// Update the updatedAt field on save
SDESheetProblemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SDESheetProblem', SDESheetProblemSchema); 