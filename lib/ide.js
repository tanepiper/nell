'use strict';
var express = require('express');
var fs = require('fs');
var _join = require('path').join;
var _format = require('util').format;
var winston = require('winston');
var swig = require('swig');
var consolidate = require('consolidate');
var async = require('async');
var mde = require('markdown-extra');
var concat = require('concat-stream');
require('longjohn');


var logger = new(winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
});

var IDE = (function() {

  var IDE = function(options) {
    if (!(this instanceof IDE)) {
      return new IDE(options);
    }

    var ide = this;

    /*
    ide.settings_fs_handler = fs.createWriteStream( _join(options.site_path, 'nell.json'));
    ide.settings_fs_handler.on('error', function(error) {
      console.log(error);
    });
    ide.settings_fs_handler.on('data', function(data) {
      console.log(data);
    });
    ide.settings_fs_handler.open();
    */

    ide.setOption = function(option) {
      ide[option.key] = JSON.stringify(option.value);
    };


    ide.run = function(cb) {

      swig.init({
        root: _join(__dirname, '..', 'ide', 'views'),
        allowErrors: true
      });

      ide.server = express();
      ide.server.engine('html', consolidate.swig);
      ide.server.set('view engine', 'html');
      ide.server.set('views', _join(__dirname, '..', 'ide', 'views'));
      ide.server.set('view cache', false);
      //ide.server.set('view engine', swig.__express);
      ide.server.use(express.static( _join(__dirname, '..', 'ide', 'static')));

      ide.server.post('/save-entry', function(req, res, next) {
        var title = req.param('title');
        var date = req.param('date');
        var content = req.param('content');
        res.json({sucess: true});
      });

      ide.server.get('/file/:type/:filename', function(req, res, next) {
        var filepath = _join(options.site_path, 'source', _format('%ss', req.param('type')), req.param('filename'));

        var processContent = concat(function(err, content_raw) {
          if (err) {
            return next(err);
          }
          var heading = mde.heading(content_raw);
          var metadata = mde.metadata(content_raw, function(md) { 
            var retObj = {};
            md.split('\n').forEach(function(line) {
              var data = line.split(':');
              retObj[data[0].trim()] = data[1].trim();
            });
            return retObj;
          });

          var content = mde.content(content_raw);

          res.render('manage-item', {
            layout: false,
            heading: heading,
            content_raw: content_raw,
            metadata: metadata,
            content: content
          });
        });

        var fh = fs.createReadStream(filepath, {encoding: 'utf8'});
        fh.on('error', next);
        fh.pipe(processContent);
      });

      ide.server.get('/get-modal', function(req, res, next) {
        var modal = req.param('modal');
        if (modal === 'info') {
          res.render('info-modal', {
            layout: false,
            config: options.config
          });
        }
      });

      ide.server.get('/site-info', function(req, res, next) {
        res.render('info-page', {
          layout: false,
          config: options.config
        });
      });

      ide.server.get('/new-item', function(req, res, next) {
        res.render('manage-item', {
          config: options.config
        });
      });

      ide.server.get('/', function(req, res, next) {

        var view_options = {};
        var view = 'dashboard';

        async.waterfall([
          function(callback) {
            view_options.config = options.config;
            view_options.layout = false;
            view_options.items = [];
            fs.readdir(_join(options.site_path, 'source', 'pages'), callback);
          }, function(items, callback) {
            var file_items = items.map(function(item) {
              if (item.indexOf('.md') !== -1) {
                view_options.items.push(['page', item]);
                return true;
              }
              return false;
            });
            
            view_options.total_pages = file_items.length;
            fs.readdir(_join(options.site_path, 'source', 'posts'), callback);
          }, function(items, callback) {
            var file_items = items.map(function(item) {
              if (item.indexOf('.md') !== -1) {
                view_options.items.push(['post', item]);
                return true;
              }
              return false;
            });
            view_options.total_posts = file_items.length;
            callback(null);
          }
        ], function(err) {
          if (err) {
            return next(err);
          }
          res.render(view, view_options);
        });
      });

      ide.server.listen(5678);
      //cb(null, 'IDE Running');
    };
  };

  return IDE;
}());

module.exports = {
  key: 'ide',
  args: null,
  desc: 'Run the IDE',
  run: function(site_path, arg, cmd, done) {

    var ide;
    var config;
    var options = {};

    async.series([
      function(callback) {
        try {
          config = require( _join(site_path, 'nell.json') );  
        } catch(e) {
          return callback(e);
        }
        return callback(null);
      },
      function(callback) {
        options.site_path = site_path;
        options.config = config;
        console.log(options);
        return callback(null);
      },
      function(callback) {
        ide = IDE(options);
        callback(null);
      },
      function(callback) {
        ide.run(callback);
      }
    ], done);
  }
};