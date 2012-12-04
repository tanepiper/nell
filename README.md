# hyde

An opinionated nodejs clone of [Octopress](http://octopress.org).  Not for production use as of yet, still in
very active development.

## Getting Started
Install the module with: `npm install -g hyde`

## Commands

* `hyde init <name>` - Generate a new static site folder

* `hyde generate` - Generate a static version of your site to the `./output` folder

* `hyde preview` - Preview the static site with express

* `hyde newpost <name>` - Create a new markdown post

* `hyde newpage <name>` - Create a new markdown page

For a full list of commands type `hyde --help`

## Creating a site

To create a site, first type `hyde init mysite` then switch in to the directory.

This will generate a folder containing:

    mysite -
            | - source -
                       | - pages
                       | - posts
            | - template -
                         | - default

From there, type `hyde generate` and the HTML will be generated to the `output` directory. To preview, type
`hyde preview`.

Edit the templates in the template folder with your layout.

## hyde.json file

When you generate a site, a `hyde.json` file will be generated in the root, it looks like this:

    {
      "theme": {
        "name": "default",
        "index": "default.jade"
      },
      "site": {
        "title": "Example Site",
        "url": "http://example.com"
      },
      "menu": [
        {
          "title": "Home",
          "path": "/"
        },
        {
          "title": "About",
          "path": "/about/"
        }
      ]
    }
    
Edit this file to change your site settings such as title, url, theme and menu.

## Contributing
Submit issues and suggestions to [https://github.com/tanepiper/hyde](https://github.com/tanepiper/hyde)

## Release History
* 2nd December 2012
    * Initial release

## License
Copyright (c) 2012 Tane Piper  
Licensed under the MIT license.
