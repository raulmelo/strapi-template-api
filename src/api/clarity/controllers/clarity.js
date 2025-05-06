'use strict';

/**
 * clarity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController("api::clarity.clarity", ({ strapi }) => ({
  async insights(ctx) {
    const { tenant } = ctx.params;

    const insights = await strapi.query("api::clarity.clarity").find({
      where: {
        tenant: tenant,
      },
      populate: {
        DataGit: true,
      },
    });

    return ctx.body = insights;
  },

  async moduleName(ctx) {
    const { moduleName } = ctx.params;

    const _module = await strapi.query("api::clarity.clarity").findOne({
      where: {
        moduleName: moduleName,
      },
      populate: {
        DataGit: true,
      },
    });

    if (!_module) {
      return ctx.notFound();
    }

    const sanitizedModule = await this.sanitizeOutput(_module, ctx);

    if (!_module) {
      return ctx.notFound();
    }

    ctx.body = sanitizedModule;

    return ctx.body;
  },
}));