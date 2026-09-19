/**
 * Idea Assignment Service Placeholder
 * Future feature: Automatic balanced random distribution of ideas to registered teams
 */

exports.assignIdeaToTeam = async (teamId, ideaId) => {
  // Placeholder implementation
  return {
    teamId,
    ideaId,
    assignedAt: new Date(),
    isRevealed: false,
  };
};

exports.autoDistributeIdeas = async () => {
  // Placeholder implementation
  return {
    assignedCount: 0,
    remainingIdeas: 0,
  };
};
