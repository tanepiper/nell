# nell

An opinionated nodejs clone of [Octopress](http://octopress.org).  Not for production use as of yet, still in
very active development.

## Getting Started
Install the module with: `npm install -g nell`

## Commands

* `nell init <name>` - Generate a new static site folder

* `nell generate` - Generate a static version of your site to the `./output` folder

* `nell preview` - Preview the static site with express

* `nell new_post <name>` - Create a new markdown post

* `nell new_page <name>` - Create a new markdown page

* `nell plugins` - See a list of all plugins available in your theme and markdown files

For a full list of commands type `nell --help`

## Creating a site

To create a site, first type `nell init mysite` then switch in to the directory.

This will generate a folder containing:

    mysite -
            | - source -
                       | - pages
                       | - posts
            | - template -
                         | - default

From there, type `nell generate` and the HTML will be generated to the `output` directory. To preview, type
`nell preview`.

Edit the templates in the template folder with your layout.

## nell.json file

When you generate a site, a `nell.json` file will be generated in the root, it looks like this:

```json
{
  "site": {
    "url": {
      "href": "http://example.com",
      "root": "/",
      "permalink": "/blog/:year/:month/:day/:title"
    },
    "title": "nell Site",
    "subtitle": "A site generated with nell",
    "author": "",
    "search": "http://google.com/search",
    "description": "",

    "theme": {
      "name": "default",
      "index": "default.jade"
    },

    "date_format": "dddd, dS mmmm yyyy @ h:MMTT",
    "paginate": {
      "number_per_page" : 5
    },

    "google_analytics_tracking_id": ""
  },

  "menu": [{
    "title": "Home",
    "path": "/"
  }, {
    "title": "About",
    "path": "/about/"
  }]
}
```
    
Edit this file to change your site settings such as title, url, theme and menu.

## Plugins

Plugins are modules that are included in your site `plugins` folder, as well as currently two included in the
nell directory - `dateformat` and `gist`.

Plugins can be used in posts with the `{% %}` tags - each plugin takes a set of required and optional arguments.
For example, the gist plugin can be used like so in markdown

    ... Some markdown content ...
    {% gist 4202899 interval.js %}
    ... Some more markdown content ...
    
They are also available in template files on the plugin object, for example in a jade template:

    h3 Posted on #{plugins.dateformat(post.date, site.date_format)}
    
Plugins are still an early development and the format may change to support more powerful features, but for now
they are simple synchronous functions that must return a value that can be output as a string (String, Number)

## Contributing
Submit issues and suggestions to [https://github.com/tanepiper/nell](https://github.com/tanepiper/nell)

## Release History
* 2nd December 2012
    * Initial release

## License
Copyright (c) 2012 Tane Piper  
Licensed under the MIT license.
