'use strict';

var hyde = require('../lib/hyde.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['createSite'] = {
  setUp: function(done) {
    var self = this;
    hyde.createSite(function(data) {
      self.data = data;
      done();
    });
  },
  'no args': function(test) {
    test.expect(1);
    // tests here
    var output =  '<!DOCTYPE html>' +
                  '<html>' +
                    '<head>' +
                      '<title>Foo Bar</title>' +
                    '</head>' +
                    '<body>' +
                      '<div class="post">' +
                        '<h1>This is a test</h1>' +
                        '<div class="main">' +
                          '<p>This is a test of the content</p>' +
                        '</div>' +
                      '</div>' +
                    '</body>' +
                    '<footer>' +
                      '<script href="http://code.jquery.com/jquery.js"></script>' +
                    '</footer>' +
                  '</html>';
    test.notStrictEqual(this.data, output, 'HTML Should match.');
    test.done();
  },
};
