'use strict';

var jade = require('jade');
var fs = require('fs');
var marked = require('marked');

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: true
});

exports.renderSite = function(options, cb) {
  var theme_path = './themes/' + options.theme;
  var template_path = theme_path + '/templates';
  var template_file = template_path + ( (options.template_file) ? '/' + options.template_file : '/default.jade');

  var template_file_content = fs.readFileSync(template_file, 'utf8');

  var output = jade.compile(template_file_content, {
    filename: template_file,
    pretty: true
  });

  // Now we read the source files
  options.locals.posts = [];

  fs.readdir('./source/posts', function(err, posts) {
    posts.forEach(function(post_file) {
      var post = fs.readFileSync('./source/posts/' + post_file, 'utf8');
      var post_object = {};
      var post_array = post.split('\n');

      post_array.forEach(function(line, index) {
        if (line.indexOf('title') !== -1) {
          post_object.title = line.split(':')[1].trim();
          post_array.splice(index, 1);
        }
      });
      // We now have body content
      console.log(post_array.join('\n'));
      post_object.content = marked(post_array.join('\n').trim());
      options.locals.posts.push(post_object);
    });

    cb(output(options.locals));
  });
};