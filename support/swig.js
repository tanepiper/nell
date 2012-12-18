/*
 * nell
 * https://github.com/tanepiper/nell
 *
 * Copyright (c) 2012 Tane Piper
 * Licensed under the MIT license.
 * https://github.com/tanepiper/nell/blob/master/LICENSE-MIT
 */
'use strict';

var swig = require('swig');

swig.init({
  allowErrors: false,
  autoescape: true,
  cache: false,
  encoding: 'utf8',
  filters: {},
  root: '/',
  tags: {},
  extensions: {},
  tzOffset: 0
});