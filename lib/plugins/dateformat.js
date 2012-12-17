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
var dateformat = require('dateformat');

module.exports = {
  key: 'dateformat',
  args: '[date, format]',
  desc: __('Provides date formatting tools, see https://github.com/felixge/node-dateformat for full docs'),
  run: dateformat
};