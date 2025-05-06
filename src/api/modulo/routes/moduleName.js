module.exports = {
  routes: [
    {
      method: "GET",
      path: "/modulos/moduleName/:moduleName",
      handler: "modulo.moduleName",
      config: {
        populate: "*"
      }
    },
    {
      method: "GET",
      path: "/modulos/sonarModules",
      handler: "modulo.getSonarModules",
      config: {
        populate: "*",
      },
    },
    {
      method: "POST",
      path: "/modulos/sonarModuleAll",
      handler: "modulo.getSonarModuleAll",
      config: {
        populate: "*",
      },
    },
  ],
};
