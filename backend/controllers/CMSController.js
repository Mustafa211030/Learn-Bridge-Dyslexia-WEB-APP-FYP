const Blog = require('../models/Blog');
const EducationalResource = require('../models/EducationalResource');

class CMSController {
  // Blog Methods
  static async getBlogs(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const query = status ? { status } : {};
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      const total = await Blog.countDocuments(query);
      res.json({ success: true, blogs, total });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
    }
  }
  
  static async createBlog(req, res) {
    try {
      const blog = await Blog.create({
        ...req.body,
        authorId: req.user.userId,
        authorName: `${req.user.firstName} ${req.user.lastName}`
      });
      res.status(201).json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create blog' });
    }
  }
  
  static async updateBlog(req, res) {
    try {
      const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update blog' });
    }
  }
  
  static async deleteBlog(req, res) {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete blog' });
    }
  }
  
  // Resource Methods
  static async getResources(req, res) {
    try {
      const resources = await EducationalResource.find().sort({ createdAt: -1 });
      res.json({ success: true, resources });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch resources' });
    }
  }
  
  static async createResource(req, res) {
    try {
      const resource = await EducationalResource.create({
        ...req.body,
        authorId: req.user.userId,
        authorName: `${req.user.firstName} ${req.user.lastName}`
      });
      res.status(201).json({ success: true, resource });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create resource' });
    }
  }
  
  static async updateResource(req, res) {
    try {
      const resource = await EducationalResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, resource });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update resource' });
    }
  }
  
  static async deleteResource(req, res) {
    try {
      await EducationalResource.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Resource deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete resource' });
    }
  }
}

module.exports = CMSController;
