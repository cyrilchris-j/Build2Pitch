const mongoose = require('mongoose');

const eventSettingsSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'BUILD2PITCH 2026',
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    submissionDeadline: {
      type: Date,
      required: true,
    },
    ideasRevealed: {
      type: Boolean,
      default: false,
    },
    maxTeamSize: {
      type: Number,
      default: 6,
    },
    minTeamSize: {
      type: Number,
      default: 1,
    },
    currentPhase: {
      type: String,
      enum: ['registration', 'idea_reveal', 'building', 'submission', 'pitching', 'concluded'],
      default: 'registration',
    },
    bannerNotice: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EventSettings', eventSettingsSchema);
