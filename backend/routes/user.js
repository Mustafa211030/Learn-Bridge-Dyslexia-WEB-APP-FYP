const express = require('express');
const User = require('../models/User');
const { 
  authenticateToken, 
  adminOnly, 
  psychologistOrAdmin, 
  authenticatedUser 
} = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data based on role
// @access  Private
router.get('/dashboard', authenticateToken, authenticatedUser, async (req, res) => {
  try {
    const { role, firstName, lastName } = req.user;

    let dashboardData = {
      welcomeMessage: `Welcome back, ${firstName} ${lastName}!`,
      userRole: role,
      navigation: []
    };

    // Role-specific dashboard data
    switch (role) {
      case 'Student':
        dashboardData.navigation = [
          { name: 'My Profile', path: '/student/profile', icon: 'user' },
          { name: 'Sessions', path: '/student/sessions', icon: 'calendar' },
          { name: 'Resources', path: '/student/resources', icon: 'book' },
          { name: 'Support', path: '/student/support', icon: 'help' }
        ];
        dashboardData.quickStats = {
          upcomingSessions: 2,
          completedSessions: 5,
          resourcesAccessed: 12
        };
        break;

      case 'Psychologist':
        dashboardData.navigation = [
          { name: 'My Patients', path: '/psychologist/patients', icon: 'users' },
          { name: 'Schedule', path: '/psychologist/schedule', icon: 'calendar' },
          { name: 'Notes', path: '/psychologist/notes', icon: 'file-text' },
          { name: 'Resources', path: '/psychologist/resources', icon: 'book' }
        ];
        dashboardData.quickStats = {
          totalPatients: 25,
          todaySessions: 4,
          pendingNotes: 3
        };
        break;

      case 'Admin':
        dashboardData.navigation = [
          { name: 'User Management', path: '/admin/users', icon: 'users' },
          { name: 'System Reports', path: '/admin/reports', icon: 'chart-bar' },
          { name: 'Settings', path: '/admin/settings', icon: 'settings' },
          { name: 'Analytics', path: '/admin/analytics', icon: 'trending-up' }
        ];
        dashboardData.quickStats = {
          totalUsers: 150,
          activeUsers: 89,
          systemAlerts: 2
        };
        break;
    }

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   GET /api/user/all
// @desc    Get all users (Admin only)
// @access  Private - Admin only
router.get('/all', authenticateToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @route   GET /api/user/by-role/:role
// @desc    Get users by role (Psychologist and Admin only)
// @access  Private - Psychologist/Admin
router.get('/by-role/:role', authenticateToken, psychologistOrAdmin, async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['Student', 'Admin', 'Psychologist'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const users = await User.find({ role })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users,
        count: users.length,
        role
      }
    });

  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users by role'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, authenticatedUser, async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    const userId = req.user.userId;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (username) updateData.username = username.trim();

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/user/:id/status
// @desc    Update user status (Admin only)
// @access  Private - Admin only
router.put('/:id/status', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
});

// @route   DELETE /api/user/:id
// @desc    Delete user (Admin only)
// @access  Private - Admin only
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

module.exports = router;