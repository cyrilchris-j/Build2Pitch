const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
    },
    startupName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    problemStatement: {
      type: String,
      default: '',
    },
    solutionOverview: {
      type: String,
      default: '',
    },
    pitchDeckUrl: {
      type: String,
      required: true,
    },
    liveDemoUrl: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    isFinal: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
