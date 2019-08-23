Changelog
=========

### Unreleased changes
* Work in progress compiler for `*.component.html` files
* Usage:
```js
var compiler = require('../web-component-js').compiler;
compiler.compile('lib', 'dist');
```

### 1.2.8
23rd August 2019
* Fix bug with autoloading of external scripts; removed dead checks

### 1.2.7
4th December 2015
* Added try/catch block for Handlebars Template expansion to provide helpful information when a bad template is supplied.

### 1.2.6
6th October 2015
* Added `Component.findByElement` to API, with worked example

### 1.2.5
11th July 2015
* Allowed element properties to be re-read into the component instance just before a data request is made
* Added Modify Properties example page to demonstrate dynamically changing element properties on the fly
* Fix for Component.configure('UPPERCASE-TAGNAME') creating an invalid lookup when using `element.tagName` as the source data.

### 1.2.4
6th July 2015
* Updated examples and created tools folder for composer
* Template tags are now removed from the page when the DOM is scanned

### 1.2.3
2nd July 2015
* Added NPM support and started work on compiler

### 1.2.2
30th June 2015
* Added the self-resolving dependency script from the Composer to web-component.js
* Changed project location to https://github.com/connected-web/web-component-js/
* Improved handling of decoded templates to occur at an appropriate time

### 1.2.0
27th June 2015
* Added Web Component Composer
* Added file encoding and decoding to `web-component.js`
* Added events to ComponentClass model
* Rewired `dataSourceMessage` to be set based on events
* Documented event types with examples
* Deprecated `preRenderStep()` in favour of `ComponentClass.on('preRenderStep', function(instance) { ... });`
* Added `ComponentClass.registeredComponents` list, enabling `ComponentClass.apply(function(instance) { ... })`

### 1.1.2
22nd June 2015
* Moved jQuery data loading into an adapter
* Created `ComponentDataSources` class to hold data adapters
* Added `ComponentDataSources.register` method to allow new data adapters to be registered

### 1.1.1
16th June 2015
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
12th June 2015
* Added fail message to data loading based on jQuery spec.

### 1.0 (Newborn)
11th June 2015
* Changed example data into JSON format.
* Statically linked data to CDN.
* Added basic examples and data-loading example.
* Created static HTML template for testing out web-component.js
* Extracted component.js from [product-monitor](https://github.com/connected-web/product-monitor) project to make web-component.js.
* Initial commit
