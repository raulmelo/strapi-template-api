module.exports = {
  routes: [
    {
      method: "GET",
      path: "/insights/data/:tenant",
      handler: "insight.insightsByTenant",
      config: {
        populate: "*",
      },
    },
  ],
};

  