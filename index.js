var render = require('./lib/render');

render.renderSite({
  theme: 'default',
  locals: {
    site: {
      title: 'Foo Bar'
    }
  }
});