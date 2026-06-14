// models/Blog.js
// Blog model for psychologist-authored content

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  slug: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },

  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },

  content: {
    type: String,
    required: [true, 'Blog content is required']
  },

  featuredImage: {
    url: { type: String, default: '' },
    filename: { type: String, default: '' },
    alt: { type: String, default: '' }
  },

  category: {
    type: String,
    enum: [
      'Child Development',
      'Parenting Tips',
      'Mental Health',
      'Learning Strategies',
      'Behavioral Issues',
      'Educational Psychology',
      'Cognitive Development',
      'Social Skills',
      'Emotional Intelligence',
      'ADHD & Focus',
      'Anxiety & Stress',
      'Study Tips',
      'Family Dynamics',
      'Special Needs',
      'Research & Insights',
      'General Wellness',
      'Other'
    ],
    default: 'General Wellness'
  },

  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  targetAudience: {
    type: String,
    enum: ['parents', 'students', 'educators', 'professionals', 'general'],
    default: 'general'
  },

  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },

  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },

  publishedAt: { type: Date, index: true },

  metrics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    readTime: { type: Number, default: 1 }
  },

  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: true }
  }],

  allowComments: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }

}, { 
  timestamps: true 
});

// Indexes
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 });

// Generate slug before saving
blogSchema.pre('save', async function(next) {
  // Generate slug from title
  if (this.isModified('title') || this.isNew) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;
    
    // Check for duplicate slugs
    const Blog = mongoose.model('Blog');
    while (await Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate read time based on content length
  if (this.isModified('content') && this.content) {
    const wordCount = this.content.split(/\s+/).filter(Boolean).length;
    this.metrics.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Generate excerpt if not provided
  if (this.isModified('content') && this.content && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 200).trim() + '...';
  }

  next();
});

// Instance methods
blogSchema.methods.incrementViews = async function() {
  this.metrics.views += 1;
  await this.save();
};

blogSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const likeIndex = this.likedBy.findIndex(id => id.toString() === userIdStr);
  
  if (likeIndex === -1) {
    this.likedBy.push(userId);
    this.metrics.likes += 1;
  } else {
    this.likedBy.splice(likeIndex, 1);
    this.metrics.likes = Math.max(0, this.metrics.likes - 1);
  }
  
  await this.save();
  return likeIndex === -1;
};

// Static methods
blogSchema.statics.getPublished = function(options = {}) {
  const { category, author, limit = 10, page = 1 } = options;
  const query = { status: 'published', visibility: 'public' };
  
  if (category) query.category = category;
  if (author) query.author = author;

  return this.find(query)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'firstName lastName profilePhoto');
};

blogSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ status: 'published', visibility: 'public', isFeatured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName profilePhoto');
};

blogSchema.statics.getRelated = async function(blogId, limit = 4) {
  const blog = await this.findById(blogId);
  if (!blog) return [];

  return this.find({
    _id: { $ne: blogId },
    status: 'published',
    visibility: 'public',
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags || [] } }
    ]
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName profilePhoto');
};

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;