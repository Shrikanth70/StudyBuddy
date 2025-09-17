const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profile: {
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [100, 'Age must be less than 100']
    },
    course: {
      type: String,
      trim: true,
      maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    progress: {
      totalStudyTime: {
        type: Number,
        default: 0
      },
      completedQuizzes: {
        type: Number,
        default: 0
      },
      createdNotes: {
        type: Number,
        default: 0
      },
      createdFlashcards: {
        type: Number,
        default: 0
      },
      streak: {
        type: Number,
        default: 0
      }
    }
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=User'
  },
  refreshToken: {
    type: String,
    select: false
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate access token (short-lived)
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-access-secret-key',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

// Generate refresh token (long-lived)
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      id: this._id,
      email: this.email
    },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret-key',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Generate JWT token (backward compatibility)
userSchema.methods.generateToken = function() {
  return this.generateAccessToken();
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
