<!--
layout: page
title: Nell Documentation
date: 2012-12-02 18:00
published: true
-->

### What is Nell?
[Nell](http://github.com/tanepiper/nell) an opinionated static site generator,  built using [nodejs](http://nodejs.org).

Nell uses [Markdown](http://daringfireball.net/projects/markdown/),  [Swig](http://paularmstrong.github.com/swig/)
templates and combines them to generate static HTML output that can easily be hosted on any server, or on service
like [Github pages](http://pages.github.com/).

### Getting Started
Provided you have nodejs installed first, you can easily install nell via npm. It is recommended you install Nell
globally to provide you the command line tool via your terminal:

    npm install nell -g

Nell comes with a basic default theme that includes [jQuery](http://jquery.com), [Bootstrap](http://twitter.github.com/bootstrap/)
and the Journal theme from [Bootswatch](http://bootswatch.com/). Also provided is a copy of the markdown for this site
that you are free to remove - but gives you a basic idea of how Nell works.

The available commands for Nell (which can also be shown by typing `nell --help`) are:

* `nell generate` - run in the working site directory, reads the `nell.json` file and processes all markdown content
to output via swig templates.
* `nell init [name]` - creates a Nell site directory, which includes a source, template and plugin directory - this
is also where the output directory will be created.
* `nell new_page [path/title]` - create a new markdown page. Command accepts a name or path and name as a quoted string (e.g
"My Page" or "path/to/My Page").
* `nell new_post [title]` - create a new markdown post. Automatically creates the file name with the current date.
* `nell preview [port]` - view the output site via an express static server.
* `nell watch [port]` - view the output site via and express static site, and regenerated on any recognised changes in the
source or theme directory.