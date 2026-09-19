const mongoose = require('mongoose');

const startupIdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    revenueModel: {
      type: String,
      required: true,
    },
    complexityLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    assignedTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);
