const planFeature = {
  free: {
    maxFileUsedPerDay: 2,
    maxQuestionsAskedPerDay: 3,
    // maxFileUsed: 60,
    // maxQuestionsAsked: 600,
  },
  basic: {
    maxFileUsedPerDay: 4,
    maxQuestionsAskedPerDay: 6,
    // maxFileUsed: 100,
    // maxQuestionsAsked: 2000,
  },
  pro: {
    maxFileUsedPerDay: 6,
    maxQuestionsAskedPerDay: 9,
    // maxFileUsed: 400,
    // maxQuestionsAsked: 10000,
  },
};

module.exports = {
  planFeature,
};
