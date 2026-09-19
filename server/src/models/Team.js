const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ['leader', 'developer', 'designer', 'pitcher', 'researcher', 'marketer'],
    default: 'developer',
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  joinedAt: { type: Date, default: Date.now },
});

const teamSchema = new mongoose.Schema(
  {
    teamNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    teamCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [teamMemberSchema],
      default: [],
      validate: [
        (val) => val.length <= 6,
        '{PATH} exceeds the limit of 6 members per team',
      ],
    },
    ideaAssignment: {
      ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupIdea' },
      ideaTitle: String,
      industry: String,
      assignedAt: Date,
      isRevealed: { type: Boolean, default: false },
      revealTime: Date,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      default: null,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    tableNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Team', teamSchema);
