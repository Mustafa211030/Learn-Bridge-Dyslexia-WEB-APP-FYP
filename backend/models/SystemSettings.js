// models/SystemSettings.js
// System Settings Model for Platform-wide Configuration

const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  settingsKey: {
    type: String,
    required: true,
    unique: true,
    default: 'main',
    index: true
  },

  // Language Settings
  languageSupport: {
    enabledLanguages: [{
      code: { type: String, enum: ['en', 'ur', 'ar', 'es', 'fr', 'de', 'zh'] },
      name: String,
      nativeName: String,
      enabled: { type: Boolean, default: true },
      isRTL: { type: Boolean, default: false }
    }],
    defaultLanguage: {
      type: String,
      enum: ['en', 'ur', 'ar', 'es', 'fr', 'de', 'zh'],
      default: 'en'
    },
    autoDetect: {
      type: Boolean,
      default: true
    }
  },

  // Accessibility Settings
  accessibilitySettings: {
    textToSpeech: {
      enabled: { type: Boolean, default: true },
      defaultSpeed: { type: Number, default: 1, min: 0.5, max: 2 },
      defaultVoice: String
    },
    dyslexiaFriendly: {
      enabled: { type: Boolean, default: true },
      defaultFont: { type: String, default: 'OpenDyslexic' },
      availableFonts: [{ type: String }],
      lineSpacing: { type: Number, default: 1.5 },
      letterSpacing: { type: Number, default: 0.1 }
    },
    highContrast: {
      enabled: { type: Boolean, default: true },
      defaultMode: { type: String, enum: ['normal', 'high', 'dark'], default: 'normal' }
    },
    fontSize: {
      minSize: { type: Number, default: 14 },
      maxSize: { type: Number, default: 24 },
      defaultSize: { type: Number, default: 16 }
    },
    colorBlindMode: {
      enabled: { type: Boolean, default: true },
      modes: [{ type: String }]
    },
    reducedMotion: {
      enabled: { type: Boolean, default: true },
      respectSystemPref: { type: Boolean, default: true }
    }
  },

  // Notification Settings
  notificationConfig: {
    email: {
      enabled: { type: Boolean, default: true },
      welcomeEmail: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true },
      assessmentAlerts: { type: Boolean, default: true }
    },
    inApp: {
      enabled: { type: Boolean, default: true },
      showBadge: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: false }
    },
    push: {
      enabled: { type: Boolean, default: false }
    }
  },

  // Security Settings
  securitySettings: {
    sessionTimeout: { type: Number, default: 60 }, // minutes
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 15 }, // minutes
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireLowercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: false }
    },
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      requiredForAdmin: { type: Boolean, default: false }
    }
  },

  // Platform Settings
  platformSettings: {
    maintenanceMode: {
      enabled: { type: Boolean, default: false },
      message: String,
      allowAdminAccess: { type: Boolean, default: true }
    },
    registrationOpen: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    allowSocialLogin: { type: Boolean, default: false },
    maxFileUploadSize: { type: Number, default: 50 }, // MB
    allowedFileTypes: [{ type: String }]
  },

  // Content Settings
  contentSettings: {
    blogModeration: {
      requireApproval: { type: Boolean, default: true },
      autoPublishVerifiedAuthors: { type: Boolean, default: false }
    },
    commentModeration: {
      enabled: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: false },
      allowAnonymous: { type: Boolean, default: false }
    },
    resourceSharing: {
      enabled: { type: Boolean, default: true },
      requireApproval: { type: Boolean, default: true }
    }
  },

  // Analytics Settings
  analyticsSettings: {
    trackUserActivity: { type: Boolean, default: true },
    retentionDays: { type: Number, default: 365 },
    anonymizeData: { type: Boolean, default: false }
  },

  // Branding Settings
  brandingSettings: {
    siteName: { type: String, default: 'LearnBridge' },
    tagline: String,
    logo: {
      light: String,
      dark: String
    },
    favicon: String,
    primaryColor: { type: String, default: '#4F46E5' },
    secondaryColor: { type: String, default: '#10B981' },
    supportEmail: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },

  // Last modified info
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
});

// Ensure only one settings document exists
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne({ settingsKey: 'main' });
  
  if (!settings) {
    // Create default settings
    settings = await this.create({
      settingsKey: 'main',
      languageSupport: {
        enabledLanguages: [
          { code: 'en', name: 'English', nativeName: 'English', enabled: true, isRTL: false },
          { code: 'ur', name: 'Urdu', nativeName: 'اردو', enabled: true, isRTL: true }
        ],
        defaultLanguage: 'en',
        autoDetect: true
      },
      accessibilitySettings: {
        dyslexiaFriendly: {
          enabled: true,
          defaultFont: 'OpenDyslexic',
          availableFonts: ['OpenDyslexic', 'Lexie Readable', 'Comic Sans MS', 'Arial'],
          lineSpacing: 1.5,
          letterSpacing: 0.1
        }
      },
      platformSettings: {
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4']
      }
    });
  }
  
  return settings;
};

// Update settings
systemSettingsSchema.statics.updateSettings = async function(updates, adminId) {
  const settings = await this.getSettings();
  
  // Deep merge updates
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
      settings[key] = { ...settings[key]?.toObject?.() || settings[key], ...updates[key] };
    } else {
      settings[key] = updates[key];
    }
  });
  
  settings.lastModifiedBy = adminId;
  await settings.save();
  
  return settings;
};

// Get public settings (safe to expose to frontend)
systemSettingsSchema.statics.getPublicSettings = async function() {
  const settings = await this.getSettings();
  
  return {
    languageSupport: {
      enabledLanguages: settings.languageSupport.enabledLanguages.filter(l => l.enabled),
      defaultLanguage: settings.languageSupport.defaultLanguage,
      autoDetect: settings.languageSupport.autoDetect
    },
    accessibilitySettings: settings.accessibilitySettings,
    brandingSettings: settings.brandingSettings,
    platformSettings: {
      maintenanceMode: settings.platformSettings.maintenanceMode,
      registrationOpen: settings.platformSettings.registrationOpen
    }
  };
};

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

module.exports = SystemSettings;
