Web Component
=============
A javascript library for very simply adding data driven web components to a HTML page, by defining your own domain specific, HTML language via templates.

Recent Releases
---------------
**Version 1.2.0** (In field testing)
27th June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.2.0/lib/web-component.js

**Version 1.1.3** (Out classed by 1.2.0)
25th June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.1.3/lib/web-component.js

**Version 1.1.2** (Seems ok)
22nd June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.1.2/lib/web-component.js

**Version 1.1.1** (Stable)
16th June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.1.1/lib/web-component.js

**Version 1.0.1** (Memory Leak, please upgrade)
12th June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.0.1/lib/web-component.js

**Version 1.0** (Newborn)
11th June 2015
* https://cdn.rawgit.com/Markavian/web-component/1.0/lib/web-component.js

Dependencies
------------
- [jQuery](https://jquery.com/) - for remote calls to server to provide components with data
- [Handlebars](http://handlebarsjs.com/) - for "minimal templating on steroids"

What it can do
--------------
Web Component is a javascript library that can turn custom HTML tags, for example:

![Web Component Data Loading Example Source](images/data-loading-example-source.png)

... into rendered content, using client side JavaScript, and template definitions:

![Web Component Data Loading Example](images/data-loading-example.png)

Online Demos
------------
Basic examples:
* `index.html` : [Index - Basic Examples](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/index.html)
* `data-loading.html` : [Data Loading - Using Static Data](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/data-loading.html)
* `tests/monitor-debug.html` : [Test Harness for Rendering](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/monitor-debug.html)

The really cool stuff:
* `tests/web-component-file-tester.html` [Web Component File Tester for Testing File Includes](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/web-component-file-tester.html)
* `tests/web-component-composer.html` [Web Component Composer for Creating File Includes](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/web-component-composer.html)

### Sample data
* `data/credits.json` : [Static Data for Data Loading](https://cdn.rawgit.com/Markavian/web-component/1.2.0/tests/data/credits.json)

How to use
----------
1. Copy script tags for jQuery, Handlebars, and Web Component into the `<head></head>` of your HTML page
2. Define a `<template for="your-custom-element"></template>` tag
3. Insert your custom tags into the page
4. Load the page in a web browser to see your custom tags render

A complete example to get you started:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Component Examples - Index</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js"></script>
  <script src="https://cdn.rawgit.com/Markavian/web-component/1.2.0/lib/web-component.js"></script>

  <style for="page">
    body { padding: 20px; font-family: sans-serif; }
  </style>

</head>
<body>
  <github-repo user="Markavian" repo="web-component"></github-repo>
  <github-repo user="johnbeech" repo="product-monitor"></github-repo>

  <template for="github-repo">
    <h2>Repository</h2>
    <li>
      <a href="https://github.com/{{user}}/{{repo}}/">
        <b>{{user}}</b>/<b>{{repo}}</b>
      </a>
    </li>
  </template>
</body>
</html>
```

Beyond this simple example, Web Component can be used for auto-loading data via jQuery AJAX calls, and re-rendering other components defined by your page template based on these events.

Projects using Web Component
----------------------------
* [Product Monitor](https://github.com/johnbeech/product-monitor/) - for rendering pretty much everything client side.

Local development setup
-------------------
```
npm install http-server -g
http-server
```
Then open http://localhost:8080 in a web-browser of your choice.

Edits can be made to `lib/web-component.js` directly, and you can use the HTML files in `tests/` as harnesses for various situations. Preferred browser for debugging is Chrome.

Web Component Wiki
------------------

Please see the wiki for documentation and examples on using the Web Component library and extending custom components with your own javascript.
* [Web Component API] (https://github.com/Markavian/web-component/wiki/Web-Component-API)

Changelog
---------

### 1.2.1
* Added the self-resolving dependency script from the Composer to web-component.js

### 1.2.0
* Added Web Component Composer
* Added file encoding and decoding to `web-component.js`
* Added events to ComponentClass model
* Rewired `dataSourceMessage` to be set based on events
* Documented event types with examples
* Deprecated `preRenderStep()` in favour of `ComponentClass.on('preRenderStep', function(instance) { ... });`
* Added `ComponentClass.registeredComponents` list, enabling `ComponentClass.apply(function(instance) { ... })`

### 1.1.2
* Moved jQuery data loading into an adapter
* Created `ComponentDataSources` class to hold data adapters
* Added `ComponentDataSources.register` method to allow new data adapters to be registered

### 1.1.1
* Fix for broken `<template for="element-name">` component registration.
* Deprecated `<template tagName="element-name">` in favour of `<template for="element-name">`
* Changed default dataSourceType value to `false` from `jsonp`
* Fixed nested component memory-leak (Issue #1)
* Added log levels OFF, WARN, INFO, and RENDER
* Styled up example pages in Online Demos section
* Added styles to credits
* Created change log

### 1.1.0 (Yanked)
* Did not scan correctly for templates in the form `<template for="element-name">`

### 1.0.1
* Added fail message to data loading based on jQuery spec.

### 1.0
* Changed example data into JSON format.
* Statically linked data to CDN.
* Added basic examples and data-loading example.
* Created static HTML template for testing out web-component.js
* Extracted component.js from [product-monitor](https://github.com/johnbeech/product-monitor) project to make web-component.js.
* Initial commit
