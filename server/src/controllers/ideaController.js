const { successResponse } = require('../utils/response');

/**
 * Idea Controller Placeholders
 */

exports.getAllIdeas = async (req, res) => {
  return successResponse(res, [
    {
      id: 'idea_01',
      title: 'Decentralized Micro-Grid Energy Balancing',
      industry: 'CleanTech',
      isAssigned: true,
    },
    {
      id: 'idea_02',
      title: 'Autonomous Localized EV Fleet Optimizer',
      industry: 'Mobility & AI',
      isAssigned: true,
    },
    {
      id: 'idea_03',
      title: 'Real-Time Edge Computer Vision for Retail Shrinkage',
      industry: 'RetailTech',
      isAssigned: false,
    },
  ], 'Startup ideas retrieved (Mock)');
};

exports.getIdeaById = async (req, res) => {
  return successResponse(res, {
    id: req.params.id,
    title: 'Precision AgriDrone Yield Forecaster',
    industry: 'AgriTech',
    problemStatement: 'Smallholder orchards lose up to 25% of crops before harvest due to undetected micro-blights.',
    targetAudience: 'High-density fruit and vineyard farm owners',
    keyFeatures: ['Multispectral drone analysis', 'Weekly nitrogen stress heatmaps'],
    revenueModel: 'Tiered acreage annual licensing',
    isAssigned: false,
  }, 'Idea details retrieved (Mock)');
};
