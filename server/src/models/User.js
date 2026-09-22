const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER', 'male', 'female', 'other', 'Male', 'Female', 'Other', null, ''],
      default: null,
    },
    section: {
      type: String,
      trim: true,
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'TEAM_LEAD', 'TEAM_MEMBER', 'admin', 'team_lead', 'member'],
      default: 'TEAM_MEMBER',
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash || !candidatePassword) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
