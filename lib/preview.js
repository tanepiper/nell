/*global __:true*/
/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var express = require('express');

module.exports = {
  key: 'preview',
  args: '[port:4000]',
  default: 4000,
  desc: __('Preview the current site in the output folder with an Express static server'),
  run: function(site_path, arg, cmd, done) {
    var port;
    try {
      
      var check_port = isNaN( parseInt(arg, 10) );
      if (check_port) {
        console.log(__('Preview error, port %s is not valid, falling back to default %d', arg, 4000));
      }
      port = check_port ? 4000 : arg;
      var server = express();
      server.use(express.static(site_path + '/output'));
      server.listen(port);
    } catch(e) {
      done(e);
      return;
    }
    done(null, __('Site preview at http://127.0.0.1:%d', port));
  }
};