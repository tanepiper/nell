'use strict';

var util = require('util');
var stream = require('stream');

var Document = (function() {

  var Document = function(options) {
    if (!(this instanceof Document)) {
      return new Document(options);
    }

    this.file = {};
    this.file.input = options.file.input;
    this.file.output = options.file.output;
    this.link = options.link;

    var stream = this;

    stream._transform = function(chunk, output, cb) {
      // chunk
      // output
      // cb
    };

  };
  util.inherit(Document, stream.Transform);

  return Document;

}());

module.exports = Document;