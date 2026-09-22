const mongoose = require('mongoose');

const eventSettingsSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'NEXTGEN',
    },
    tagline: {
      type: String,
      default: 'Shape What\'s Next.',
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    challengeOpen: {
      type: Boolean,
      default: false,
    },
    submissionOpen: {
      type: Boolean,
      default: false,
    },
    maxTeamSize: {
      type: Number,
      default: 6,
    },
    maxIdeaAttempts: {
      type: Number,
      default: 2,
    },
    bannerNotice: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('EventSettings', eventSettingsSchema);
