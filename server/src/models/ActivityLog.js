const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'TEAM_REGISTERED',
        'MEMBER_ADDED',
        'MEMBER_REMOVED',
        'IDEA_ROLLED',
        'IDEA_LOCKED',
        'SUBMISSION_UPDATED',
        'SUBMISSION_SUBMITTED',
        'ADMIN_VIEWED_TEAM',
        'USER_LOGIN',
        'USER_LOGOUT',
      ],
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient lookups
activityLogSchema.index({ teamId: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
