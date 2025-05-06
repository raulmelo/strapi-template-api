'use strict';

/**
 * clarity router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::clarity.clarity');
