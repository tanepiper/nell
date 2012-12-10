/*
 * hyde
 * https://github.com/tanepiper/hyde
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/hyde/blob/master/LICENSE-MIT
 */
'use strict';

var express = require('express');

module.exports = {
  key: 'preview',
  args: '[port:4000]',
  default: 4000,
  desc: 'preview site',
  run: function(site_path, arg, cmd, done) {
    var port;
    try {
      
      var check_port = isNaN( parseInt(arg, 10) );
      if (check_port) {
        console.log('Preview error, port ' + arg + ' is not valid, falling back to default ' + 4000);
      }
      port = check_port ? 4000 : arg;
      var server = express();
      server.use(express.static(site_path + '/output'));
      server.listen(port);
    } catch(e) {
      done(e);
      return;
    }
    done(null, 'Site preview at http://127.0.0.1:' + port);
  }
};