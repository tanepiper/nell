/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 */

'use strict';

exports.createSite = function(cb) {
  var render = require('./render');

  render.renderSite({
    theme: 'default',
    locals: {
      site: {
        title: 'Foo Bar'
      }
    }
  }, cb);
};
