const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    unique: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  topic: {
    type: String,
    required: [true, 'Please provide a topic'],
    enum: [
      'Arrays',
      'Strings',
      'Linked List',
      'Stack',
      'Queue',
      'Hashing',
      'Recursion & Backtracking',
      'Searching',
      'Sorting',
      'Binary Search',
      'Sliding Window',
      'Two Pointers',
      'Bit Manipulation',
      'Mathematics & Number Theory',
      'Greedy Algorithms',
      'Dynamic Programming',
      'Graphs',
      'Trees',
      'Tries',
      'Heaps',
      'Disjoint Set Union',
      'Topological Sort',
      'Segment Tree',
      'Monotonic Stack',
      'Matrix Problems',
      'Game Theory',
      'Geometry',
      'Advanced Data Structures'
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
  otherLinks: [
    {
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  description: {
    type: String,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  hints: [
    {
      type: String,
      maxlength: [1000, 'Hint cannot be more than 1000 characters']
    }
  ],
  solutionApproaches: [
    {
      title: {
        type: String,
        required: true
      },
      approach: {
        type: String,
        required: true
      },
      timeComplexity: {
        type: String
      },
      spaceComplexity: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
ProblemSchema.index({ title: 'text', tags: 'text' });

// Update the updatedAt field on save
ProblemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Problem', ProblemSchema); 