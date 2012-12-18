/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var wrench = require('wrench');
var path = require('path');

module.exports = function(nell_site, done) {

  var theme = (nell_site.theme && nell_site.theme.name) ? nell_site.theme.name : 'default';

  wrench.copyDirRecursive(path.join(nell_site.site_path, 'themes', theme, 'static'), path.join(nell_site.site_path, 'output', 'static'), done );


};