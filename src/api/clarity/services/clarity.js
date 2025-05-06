'use strict';

/**
 * clarity service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::clarity.clarity');
