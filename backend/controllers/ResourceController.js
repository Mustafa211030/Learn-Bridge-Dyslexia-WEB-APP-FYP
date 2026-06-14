// controllers/ResourceController.js
// Controller for educational resource CRUD operations

const EducationalResource = require('../models/EducationalResource');
const path = require('path');

/**
 * Upload a new educational resource
 */
exports.createResource = async (req, res) => {
  try {
    const uploadedBy = req.user._id;
    const {
      title,
      description,
      file,
      thumbnail,
      resourceType,
      category,
      tags,
      targetAudience,
      ageRange,
      gradeLevel,
      visibility,
      language,
      duration,
      pageCount,
      instructions,
      learningObjectives,
      prerequisites
    } = req.body;

    // Validate required fields
    if (!title || !file?.url) {
      return res.status(400).json({
        success: false,
        message: 'Title and file URL are required'
      });
    }

    const resource = new EducationalResource({
      uploadedBy,
      title,
      description,
      file,
      thumbnail,
      resourceType: resourceType || 'document',
      category: category || 'Other',
      tags: tags || [],
      targetAudience: targetAudience || 'general',
      ageRange: ageRange || { min: 0, max: 18 },
      gradeLevel: gradeLevel || ['all'],
      visibility: visibility || 'public',
      language: language || 'English',
      duration,
      pageCount,
      instructions,
      learningObjectives: learningObjectives || [],
      prerequisites: prerequisites || []
    });

    await resource.save();
    await resource.populate('uploadedBy', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource
    });
  } catch (error) {
    console.error('Create Resource Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

/**
 * Get all resources for the authenticated psychologist
 */
exports.getMyResources = async (req, res) => {
  try {
    const uploadedBy = req.user._id;
    const { status, category, resourceType, page = 1, limit = 20 } = req.query;

    const query = { uploadedBy };
    if (status) query.status = status;
    if (category) query.category = category;
    if (resourceType) query.resourceType = resourceType;

    const resources = await EducationalResource.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await EducationalResource.countDocuments(query);

    // Get counts by category
    const categoryCounts = await EducationalResource.aggregate([
      { $match: { uploadedBy: uploadedBy } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      resources,
      categoryCounts: categoryCounts.map(c => ({ category: c._id, count: c.count })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get My Resources Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

/**
 * Get a single resource by ID
 */
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await EducationalResource.findById(id)
      .populate('uploadedBy', 'firstName lastName email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check access
    if (resource.visibility === 'private' && 
        !resource.uploadedBy._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment views
    await resource.incrementViews();

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Get Resource Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};

/**
 * Update a resource
 */
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadedBy = req.user._id;
    const updates = req.body;

    const resource = await EducationalResource.findOne({
      _id: id,
      uploadedBy
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title', 'description', 'thumbnail', 'resourceType', 'category',
      'tags', 'targetAudience', 'ageRange', 'gradeLevel', 'status',
      'visibility', 'language', 'duration', 'pageCount', 'instructions',
      'learningObjectives', 'prerequisites', 'isFeatured'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        resource[field] = updates[field];
      }
    });

    await resource.save();

    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Update Resource Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

/**
 * Delete a resource
 */
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadedBy = req.user._id;

    const resource = await EducationalResource.findOneAndDelete({
      _id: id,
      uploadedBy
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Note: File deletion from storage should be handled here
    // depending on your storage solution (S3, local, etc.)

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete Resource Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

/**
 * Get published resources (public endpoint)
 */
exports.getPublishedResources = async (req, res) => {
  try {
    const { 
      category, 
      resourceType, 
      targetAudience,
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = { status: 'published', visibility: 'public' };
    if (category) query.category = category;
    if (resourceType) query.resourceType = resourceType;
    if (targetAudience) query.targetAudience = targetAudience;

    let resources;
    let total;

    if (search) {
      resources = await EducationalResource.search(search, { page, limit });
      total = resources.length;
    } else {
      resources = await EducationalResource.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('uploadedBy', 'firstName lastName');

      total = await EducationalResource.countDocuments(query);
    }

    res.json({
      success: true,
      resources,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Published Resources Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

/**
 * Record a download
 */
exports.recordDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const ipAddress = req.ip;

    const resource = await EducationalResource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check access
    if (resource.status !== 'published' && 
        !resource.uploadedBy.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await resource.recordDownload(userId, ipAddress);

    res.json({
      success: true,
      message: 'Download recorded',
      downloadUrl: resource.file.url
    });
  } catch (error) {
    console.error('Record Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record download',
      error: error.message
    });
  }
};

/**
 * Toggle like on a resource
 */
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const resource = await EducationalResource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const liked = await resource.toggleLike(userId);

    res.json({
      success: true,
      liked,
      likes: resource.metrics.likes
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
 * Rate a resource
 */
exports.rateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const resource = await EducationalResource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await resource.addRating(userId, rating, review);

    res.json({
      success: true,
      message: 'Rating submitted',
      avgRating: resource.metrics.avgRating,
      totalRatings: resource.metrics.totalRatings
    });
  } catch (error) {
    console.error('Rate Resource Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate resource',
      error: error.message
    });
  }
};

/**
 * Get popular resources
 */
exports.getPopularResources = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const resources = await EducationalResource.getPopular(parseInt(limit));

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Get Popular Resources Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular resources',
      error: error.message
    });
  }
};

/**
 * Get resource categories with counts
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await EducationalResource.aggregate([
      { $match: { status: 'published', visibility: 'public' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const resourceTypes = await EducationalResource.aggregate([
      { $match: { status: 'published', visibility: 'public' } },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count })),
      resourceTypes: resourceTypes.map(r => ({ name: r._id, count: r.count }))
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
