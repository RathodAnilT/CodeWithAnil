const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: [50000, 'Content cannot be more than 50000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Comment cannot be more than 500 characters']
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  coverImage: {
    type: String
  },
  readTime: {
    type: Number,
    default: 5 // Default read time in minutes
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  slug: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for search
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Generate slug from title
BlogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .concat('-', Date.now().toString().slice(-4));
  }
  
  this.updatedAt = Date.now();
  next();
});

// Virtual for comment count
BlogSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual for like count
BlogSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

module.exports = mongoose.model('Blog', BlogSchema); 