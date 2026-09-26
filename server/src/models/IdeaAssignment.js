const mongoose = require('mongoose');

/**
 * Tracks a team's rolling session against the idea pool.
 *
 * status: 'ROLLED'  -> team has rolled, not locked yet
 *         'LOCKED'  -> idea permanently locked (attempts used, no more rolls)
 */
const ideaAssignmentSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true, trim: true },
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StartupIdea',
      default: null,
    },
    candidateIdeaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StartupIdea',
      },
    ],
    attemptsUsed: { type: Number, default: 0, min: 0, max: 2 },
    status: { type: String, enum: ['SELECTING', 'ROLLED', 'LOCKED'], default: 'SELECTING' },
    selectedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

// One assignment per team — enforces "a team rolls/locks exactly once".
ideaAssignmentSchema.index({ teamId: 1 }, { unique: true });
ideaAssignmentSchema.index({ ideaId: 1, status: 1 });

module.exports = mongoose.model('IdeaAssignment', ideaAssignmentSchema);