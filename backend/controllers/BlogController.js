// controllers/BlogController.js
// Controller for blog CRUD operations - Full working version

const Blog = require('../models/Blog');
const path = require('path');
const fs = require('fs');

/**
 * Create a new blog post
 * POST /api/blogs
 */
exports.createBlog = async (req, res) => {
  try {
    const authorId = req.user._id;
    
    console.log('📝 Creating blog...');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file ? req.file.filename : 'No file');

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      targetAudience,
      status = 'draft',
      allowComments = true,
      isFeatured = false
    } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      if (typeof tags === 'string') {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        }
      } else if (Array.isArray(tags)) {
        parsedTags = tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
      }
    }

    // Parse booleans
    const parseBool = (val) => val === true || val === 'true';

    // Create blog data
    const blogData = {
      author: authorId,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || content.substring(0, 200).trim() + '...',
      category: category || 'General Wellness',
      tags: parsedTags,
      targetAudience: targetAudience || 'general',
      status: status || 'draft',
      allowComments: parseBool(allowComments),
      isFeatured: parseBool(isFeatured)
    };

    // Handle featured image from multer
    if (req.file) {
      const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
      blogData.featuredImage = {
        url: `${baseUrl}/uploads/blogs/${req.file.filename}`,
        filename: req.file.filename,
        alt: title.trim()
      };
    }

    const blog = new Blog(blogData);
    await blog.save();
    await blog.populate('author', 'firstName lastName email profilePhoto');

    console.log('✅ Blog created:', blog._id);

    res.status(201).json({
      success: true,
      message: status === 'published' ? 'Blog published successfully!' : 'Blog saved as draft!',
      blog
    });
  } catch (error) {
    console.error('❌ Create Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
};

/**
 * Get all blogs for authenticated psychologist
 * GET /api/blogs/psychologist/my-blogs
 */
exports.getMyBlogs = async (req, res) => {
  try {
    const authorId = req.user._id;
    const { status, category, page = 1, limit = 20 } = req.query;

    const query = { author: authorId };
    if (status) query.status = status;
    if (category) query.category = category;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-comments -likedBy');

    const total = await Blog.countDocuments(query);

    // Get counts by status
    const [allCount, draftCount, publishedCount, archivedCount] = await Promise.all([
      Blog.countDocuments({ author: authorId }),
      Blog.countDocuments({ author: authorId, status: 'draft' }),
      Blog.countDocuments({ author: authorId, status: 'published' }),
      Blog.countDocuments({ author: authorId, status: 'archived' })
    ]);

    res.json({
      success: true,
      blogs,
      counts: {
        all: allCount,
        draft: draftCount,
        published: publishedCount,
        archived: archivedCount
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get My Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

/**
 * Get single blog by ID for editing
 * GET /api/blogs/psychologist/:id
 */
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;

    const blog = await Blog.findOne({
      _id: id,
      author: authorId
    }).populate('author', 'firstName lastName email profilePhoto');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

/**
 * Update blog post
 * PUT /api/blogs/:id
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;
    
    console.log('📝 Updating blog:', id);
    console.log('Body:', JSON.stringify(req.body, null, 2));

    const blog = await Blog.findOne({ _id: id, author: authorId });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Update fields
    const allowedFields = ['title', 'content', 'excerpt', 'category', 'targetAudience', 'status', 'allowComments', 'isFeatured'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'allowComments' || field === 'isFeatured') {
          blog[field] = req.body[field] === true || req.body[field] === 'true';
        } else {
          blog[field] = req.body[field];
        }
      }
    });

    // Handle tags
    if (req.body.tags !== undefined) {
      let parsedTags = req.body.tags;
      if (typeof parsedTags === 'string') {
        try {
          parsedTags = JSON.parse(parsedTags);
        } catch (e) {
          parsedTags = parsedTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        }
      }
      blog.tags = Array.isArray(parsedTags) ? parsedTags : [];
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (blog.featuredImage?.filename) {
        const oldPath = path.join(__dirname, '../public/uploads/blogs', blog.featuredImage.filename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
      blog.featuredImage = {
        url: `${baseUrl}/uploads/blogs/${req.file.filename}`,
        filename: req.file.filename,
        alt: blog.title
      };
    } else if (req.body.removeImage === 'true') {
      // Remove image
      if (blog.featuredImage?.filename) {
        const oldPath = path.join(__dirname, '../public/uploads/blogs', blog.featuredImage.filename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      blog.featuredImage = { url: '', filename: '', alt: '' };
    }

    await blog.save();
    await blog.populate('author', 'firstName lastName email profilePhoto');

    console.log('✅ Blog updated:', blog._id);

    res.json({
      success: true,
      message: 'Blog updated successfully!',
      blog
    });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
};

/**
 * Delete blog post
 * DELETE /api/blogs/:id
 */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user._id;

    const blog = await Blog.findOne({ _id: id, author: authorId });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete featured image
    if (blog.featuredImage?.filename) {
      const imagePath = path.join(__dirname, '../public/uploads/blogs', blog.featuredImage.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Blog deleted successfully!'
    });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
};

/**
 * Get published blogs (public)
 * GET /api/blogs/published
 */
exports.getPublishedBlogs = async (req, res) => {
  try {
    const { category, tag, author, page = 1, limit = 12 } = req.query;

    const query = { status: 'published', visibility: 'public' };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'firstName lastName profilePhoto')
      .select('-comments -likedBy');

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Published Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

/**
 * Get blog by slug (public)
 * GET /api/blogs/slug/:slug
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      status: 'published',
      visibility: 'public'
    }).populate('author', 'firstName lastName profilePhoto')
      .populate('comments.user', 'firstName lastName profilePhoto');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.metrics.views += 1;
    await blog.save();

    // Get related posts
    const relatedPosts = await Blog.getRelated(blog._id, 4);

    res.json({
      success: true,
      blog,
      relatedPosts
    });
  } catch (error) {
    console.error('Get Blog By Slug Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

/**
 * Toggle like on blog
 * POST /api/blogs/:id/like
 */
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findOne({ _id: id, status: 'published' });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const liked = await blog.toggleLike(userId);

    res.json({
      success: true,
      liked,
      likes: blog.metrics.likes
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message
    });
  }
};

/**
 * Add comment to blog
 * POST /api/blogs/:id/comment
 */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const blog = await Blog.findOne({
      _id: id,
      status: 'published',
      allowComments: true
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or comments disabled'
      });
    }

    blog.comments.push({
      user: userId,
      content: content.trim(),
      createdAt: new Date(),
      isApproved: true
    });
    
    blog.metrics.comments = blog.comments.length;
    await blog.save();

    await blog.populate('comments.user', 'firstName lastName profilePhoto');
    const newComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added!',
      comment: newComment
    });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

/**
 * Get featured blogs
 * GET /api/blogs/featured
 */
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({
      status: 'published',
      visibility: 'public',
      isFeatured: true
    })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .populate('author', 'firstName lastName profilePhoto')
      .select('-comments -likedBy -content');

    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Get Featured Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured blogs',
      error: error.message
    });
  }
};

/**
 * Get categories with counts
 * GET /api/blogs/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published', visibility: 'public' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories: categories.map(c => ({
        name: c._id,
        count: c.count
      }))
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

module.exports = exports; 