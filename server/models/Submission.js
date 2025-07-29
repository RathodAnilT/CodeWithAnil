const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: [true, 'Please provide code'],
    maxlength: [50000, 'Code cannot be more than 50000 characters']
  },
  language: {
    type: String,
    required: [true, 'Please provide a language'],
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'ruby', 'php', 'typescript', 'swift']
  },
  output: {
    type: String
  },
  status: {
    type: String,
    enum: ['accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error', 'pending', 'processing'],
    default: 'pending'
  },
  executionTime: {
    type: Number // in milliseconds
  },
  memoryUsage: {
    type: Number // in KB
  },
  testcases: [
    {
      input: {
        type: String
      },
      expectedOutput: {
        type: String
      },
      actualOutput: {
        type: String
      },
      passed: {
        type: Boolean
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on user and problem for faster lookups
SubmissionSchema.index({ user: 1, problem: 1 });

// Create index on createdAt for sorting
SubmissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Submission', SubmissionSchema); 