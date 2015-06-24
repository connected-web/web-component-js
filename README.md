Web Component
=============
A javascript library for very simply adding data driven web components to a HTML page, by defining your own domain specific, HTML language via templates.

Recent Releases
---------------
**Version 1.1.2** (In field testing)
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
* `index.html` : [Index - Basic Examples](https://cdn.rawgit.com/Markavian/web-component/1.1.0/tests/index.html)
* `data-loading.html` : [Data Loading - Using Static Data](https://cdn.rawgit.com/Markavian/web-component/1.1.0/tests/data-loading.html)
* `data/credits.json` : [Static Data for Data Loading](https://cdn.rawgit.com/Markavian/web-component/1.1.0/tests/data/credits.json)
* `tests/monitor-debug.html` : [Test Harness for Rendering](https://cdn.rawgit.com/Markavian/web-component/1.1.0/tests/monitor-debug.html)

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
  <script src="https://cdn.rawgit.com/Markavian/web-component/1.0/lib/web-component.js"></script>

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
<body>
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

Event API
---------

### ComponentClass.on(eventName, fn)
To register for events, the on method on a `ComponentClass` lets you define a class level event handler for all instances of that component. The supplied function can expect a `webComponent` instance passed into it pertaining to an individual instance.

In the following example, the `custom-status-component` is registered via a template, and then configured to set a custom `alertType` on `init`, on `dataLoadSuccess`, and on `dataLoadFailed`.
```html

  <template for="custom-status-component" refresh-time="5">
    <button type="button" class="btn btn-{{alertType}}">
      <span>{{content}}</span>
    </button>
  </template>

  <script type="text/javascript">
    $(function() {
      var CustomStatusComponent = Component.configure("custom-status-component");

      CustomStatusComponent.on("waitingForServer", function(instance) {
        instance.alertType = "info";
      });

      CustomStatusComponent.on("dataLoadSuccess", function(instance) {
        instance.alertType = "success";
      });

      CustomStatusComponent.on("dataLoadFailed", function(instance) {
        instance.alertType = "danger";
      });
    });
  </script>
```
The `this` context for the event handler will always be the web component instance.

### instance.dispatchEvent(eventName)

If you want to manually fire an event, or trigger a custom event, you can use the `dispatchEvent(eventName)` command on an instance. This will cause any event handlers that have been registered to fire.

In the following example the `ComponentClass.apply(fn)` method is used to trigger an `init` event on all `custom-button-component` instances on the page.
```html
<custom-button-component>Hello John</custom-button-component>
<custom-button-component>Hello Anna</custom-button-component>
<custom-button-component>Hello Elmira</custom-button-component>

<template for="custom-button-component" refresh-time="5">
  <button type="button" class="btn btn-{{alertType}}">
    <span>{{content}}</span>
  </button>
</template>

<script type="text/javascript">
  $(function() {
    var ButtonComponent = Component.configure("custom-button-component");

    // Associate a static method for handling click events
    ButtonComponent.handleClick = function(instance) {
      alert("The button says: " + instance.content);
    }

    // Register the init method with something interesting
    ButtonComponent.on('init', function(instance) {
      instance.element.onclick = function() {
        ButtonComponent.handleClick(instance);
      };
    });

    // Trigger the init event on all existing ButtonComponent instances
    ButtonComponent.apply(function(instance) {
      instance.dispatchEvent("init");
    });

  });
</script>
```

### init
The `init` event is fired when a new component of `ComponentClass` is created. If you are using templates and inline elements to define your components, then this will trigger on page load before you have chance to hook into the event.

### dataSourceUpdate
The `dataSourceUpdate` event is fired any time `updateDataSourceStatus` is fired with a new message.

```html
<script type="text/javascript">
  $(function() {
    var DataComponent = Component.configure("custom-data-component");

    // Log a message to the console on every dataSourceUpdate
    DataComponent.on('dataSourceUpdate', function(instance) {
      console.log("Data source update on " + instance.webComponentId + ": " + instance.dataSourceMessage);
    });

  });
</script>
```

### waitingForServer
The `waitingForServer` event is fired when a data load request has been started by an adapter.

### dataLoadSuccess
The `dataLoadSuccess` event is fired when a data load returns with data.

### dataLoadFailed
The `dataLoadFailed` event is fired when data flat out fails to load, due to bad network, or a bad response from the server.

### dataReturnedError
The `dataReturnedError` event is fired when data is loaded successfully, but the `data.error` property was set to a non falsey value.

### dataUnexpectedFormat
The `dataUnexpectedFormat` event is fired when the returned data is `null` or not an object.

### dataLoadCompleteOnMissingElement
The `dataLoadCompleteOnMissingElement` is fired if a data load completes on an element that is no longer attached to the DOM.

The component will then be deregistered for the garbage collector to pick up.

### preRenderStep
The `preRenderStep` event is fired just before calling the body of the render function and expanding the template. This event hook is useful for applying some client side transformations to data immediately before rendering, for example mapping numeric values to CSS classes for styling purposes.
```html
  <custom-status-component status-code="200">Am I ok?</custom-status-component>
  <custom-status-component status-code="400">Not ok?</custom-status-component>
  <custom-status-component status-code="300">Informative?</custom-status-component>
  <custom-status-component status-code="500">Warning?</custom-status-component>

  <template for="custom-status-component">
    <span class="btn btn-{{alertType}}">{{content}}</span>
  </template>

  <script type="text/javascript">
    $(function() {
      var StatusComponent = Component.configure("custom-status-component");

      // Map data.statusCode to alertType immediately before rendering
      StatusComponent.on('preRenderStep', function(instance) {
        var severity = Math.round(instance["status-code"] / 100) * 100;
        instance.alertType = ({
          "0": 'info',
          "100": 'primary',
          "200": 'success',
          "300": 'info',
          "400": 'danger',
          "500": 'warning'
        })[severity] || 'danger';
      });

      // Force a re-render now
      StatusComponent.apply(function(instance) {
        instance.render();
      });

    });
  </script>
```

### renderComplete
The `renderComplete` event is fired at the end of the render function. This event hook is useful for attaching additional JavaScript to the template post-instance creation. If you need to force a rerender immediately after page load, then you can use the `ComponentClass.apply(fn)` method to achieve this.

```html
<custom-clickable-component>Hello John</custom-clickable-component>
<custom-clickable-component>Hello James</custom-clickable-component>
<custom-clickable-component>Hello Hatty</custom-clickable-component>

<template for="custom-clickable-component">
  <span class="btn btn-default">{{content}}</span>
</template>

<script type="text/javascript">
  $(function() {
    var ClickableComponent = Component.configure("custom-clickable-component");

    // Map data.statusCode to alertType immediately before rendering
    ClickableComponent.on('renderComplete', function(instance) {
      instance.element.onclick = function() {
        alert("You clicked me: " + instance.content);
      }
    });

    // Force all components to re-render
    ClickableComponent.apply(function(instance) {
      instance.render();
    });

  });
</script>
```

Changelog
---------

### Unreleased
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
