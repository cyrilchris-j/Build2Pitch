const mongoose = require('mongoose');

/**
 * How a StartupIdea is claimed by teams:
 *
 *   assignedTeamId = null           -> available in the pool
 *   assignedTeamId = "<team>:ROLLED"-> temporarily reserved while the team is
 *                                     deciding (release back on ROLL AGAIN,
 *                                     or convert to a permanent lock)
 *   assignedTeamId = "<team>"       -> permanently locked to that team
 */
const startupIdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    problemStatement: { type: String, required: true },
    targetAudience: { type: String, required: true },
    keyFeatures: {
      type: [String],
      default: [],
    },
    revenueModel: {
      type: String,
      default: '',
    },
    complexityLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
    assignedTeamId: {
      type: String,
      default: null,
      index: true,
    },
    reservedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        delete ret._id;
        delete ret.assignedTeamId;
        delete ret.reservedAt;
        return ret;
      },
    },
  }
);

startupIdeaSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : undefined;
});

startupIdeaSchema.index({ isActive: 1, assignedTeamId: 1 });

module.exports = mongoose.model('StartupIdea', startupIdeaSchema);