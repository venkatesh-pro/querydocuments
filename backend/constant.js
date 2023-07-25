const planFeature = {
  free: {
    maxFileUsedPerDay: 3,
    maxQuestionsAskedPerDay: 30,
    // maxFileUsed: 60,
    // maxQuestionsAsked: 600,
    maximumPage: 20,
  },
  basic: {
    maxFileUsedPerDay: 5,
    maxQuestionsAskedPerDay: 100,
    // maxFileUsed: 100,
    // maxQuestionsAsked: 2000,
    maximumPage: 300,
  },
  pro: {
    maxFileUsedPerDay: 20,
    maxLinkPerDay: 20,
    maxQuestionsAskedPerDay: 500,
    // maxFileUsed: 400,
    // maxQuestionsAsked: 10000,
    maximumPage: 1500,
  },
};

module.exports = {
  planFeature,
};
