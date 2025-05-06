'use strict';

/**
 * gitinfo service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gitinfo.gitinfo');
