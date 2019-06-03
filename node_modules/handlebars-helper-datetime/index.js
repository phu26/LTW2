/**
 * Handlebars Helper: {{datetime}}
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */
'use strict';

var moment = require('moment');

// Export helpers
module.exports.register = function (Handlebars) {

  // Format date to RFC-822 datetime for XML feeds
  Handlebars.registerHelper('datetime', function(date) {
    date = date || moment();
    return moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
  });
};