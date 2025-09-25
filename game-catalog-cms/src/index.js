'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/*{ strapi }*/) {
    // register your global middlewares, configurations, policies, services...
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap(/*{ strapi }*/) {
    // bootstrap your application here...
  },
};