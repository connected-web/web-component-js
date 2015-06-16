Web Component
=============
A javascript library for adding data driven web components, via templates to a HTML page.

Recent Releases
---------------
**Version 1.0.1** (Stable)
* https://cdn.rawgit.com/Markavian/web-component/1.0.1/lib/web-component.js

**Version 1.0** (Newborn)
* https://cdn.rawgit.com/Markavian/web-component/1.0/lib/web-component.js

Online Demos
------------
* `index.html` : [Index - Unstyled Tests](https://cdn.rawgit.com/Markavian/web-component/1.0.1b/tests/)
* `data-loading.html` : [Data Loading - Using Static Data](https://cdn.rawgit.com/Markavian/web-component/1.0.1b/tests/data-loading.html) -
* `data/credits.json` : [Static Data for Data Loading](https://cdn.rawgit.com/Markavian/web-component/1.0.1b/tests/data/credits.json)

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

Change Log
----------

### Unreleased Changes
* Changed default dataSourceType value to `false` from `jsonp`
* Added monitor-debug test to investigate nested component memory-leak
* Created change log
* Added styles to credits

### 1.0.1
* Added fail message to data loading based on jQuery spec.

### 1.0
* Changed example data into JSON format.
* Statically linked data to CDN.
* Added basic examples and data-loading example.
* Created static HTML template for testing out web-component.js
* Extracted component.js from [product-monitor](https://github.com/johnbeech/product-monitor) project to make web-component.js.
* Initial commit
