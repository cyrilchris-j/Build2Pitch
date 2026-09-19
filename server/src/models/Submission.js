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
      default: '',
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    visitingCardUrl: {
      type: String,
      default: '',
    },
    posterUrl: {
      type: String,
      default: '',
    },
    linkedinBannerUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    deployedUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    pitchDeckUrl: {
      type: String,
      default: '',
    },
    businessModel: {
      type: String,
      default: '',
    },
    finalPitchNotes: {
      type: String,
      default: '',
    },
    submissionStatus: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'LOCKED'],
      default: 'NOT_STARTED',
    },
    isFinal: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: null,
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
