const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  solvedProblems: [
    {
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
      },
      source: {
        type: String,
        enum: ['leetcode', 'gfg', 'other'],
        default: 'leetcode'
      },
      solvedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // SDE Sheet Problems progress tracking
  sheetProgress: [
    {
      problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SDESheetProblem',
        required: true
      },
      status: {
        type: String,
        enum: ['solved', 'unsolved', 'in_progress'],
        default: 'unsolved'
      },
      isBookmarked: {
        type: Boolean,
        default: false
      },
      notes: {
        type: String,
        maxlength: [2000, 'Notes cannot be more than 2000 characters']
      },
      lastAttempted: {
        type: Date
      },
      solvedAt: {
        type: Date
      }
    }
  ],
  blogPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  bookmarks: [
    {
      itemType: {
        type: String,
        required: true,
        enum: ['blog', 'problem']
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookmarks.itemType'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  activity: {
    type: Map,
    of: Number,
    default: {}
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add problem to solved list and update activity
UserSchema.methods.addSolvedProblem = function (problemId, source = 'leetcode') {
  // Check if problem is already solved
  const isSolved = this.solvedProblems.some(
    problem => problem.problemId.toString() === problemId.toString()
  );

  if (!isSolved) {
    // Add to solved problems
    this.solvedProblems.push({
      problemId,
      source,
      solvedAt: new Date()
    });

    // Update activity calendar
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentCount = this.activity.get(today) || 0;
    this.activity.set(today, currentCount + 1);
  }

  return this.save();
};

// Update SDE Sheet problem status
UserSchema.methods.updateSheetProblemStatus = function (problemId, status, isBookmarked) {
  // Find the problem in the user's progress
  const problemIndex = this.sheetProgress.findIndex(
    progress => progress.problemId.toString() === problemId.toString()
  );

  const now = new Date();

  // If problem exists in progress, update it
  if (problemIndex !== -1) {
    if (status) {
      this.sheetProgress[problemIndex].status = status;
      this.sheetProgress[problemIndex].lastAttempted = now;

      // If marked as solved, update solvedAt
      if (status === 'solved' && !this.sheetProgress[problemIndex].solvedAt) {
        this.sheetProgress[problemIndex].solvedAt = now;

        // Update activity calendar
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentCount = this.activity.get(today) || 0;
        this.activity.set(today, currentCount + 1);
      }
    }

    // Update bookmark status if provided
    if (isBookmarked !== undefined) {
      this.sheetProgress[problemIndex].isBookmarked = isBookmarked;
    }
  } else {
    // If problem doesn't exist in progress, add it
    const newProgress = {
      problemId,
      lastAttempted: now
    };

    if (status) {
      newProgress.status = status;

      // If marked as solved, update solvedAt
      if (status === 'solved') {
        newProgress.solvedAt = now;

        // Update activity calendar
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const currentCount = this.activity.get(today) || 0;
        this.activity.set(today, currentCount + 1);
      }
    }

    if (isBookmarked !== undefined) {
      newProgress.isBookmarked = isBookmarked;
    }

    this.sheetProgress.push(newProgress);
  }

  return this.save();
};

module.exports = mongoose.model('User', UserSchema); 