(function() {
  // The unique ID for this script
  var scriptUUID = "{{scriptUUID}}";

  // A list of required scripts
  var requiredScripts = {
    "Component": "//cdn.rawgit.com/connected-web/web-component-js/1.2.2/lib/web-component.js"
  };

  // Helper to priority load a script in the head of the page
  var loadScript = function(name, path) {
    var script = document.createElement('script');
    script.src = path;
    script.type = 'text/javascript';
    window["Loading" + name] = script;
    document.getElementsByTagName('head')[0].appendChild(script);
    console.log("Make this component load faster by including: " + path + " into the head of this page.");
  };

  // Helper to check if requirements have loaded
  var stillWaitingForRequirements = function() {
    var stillWaiting = false;
    for(var key in requiredScripts) {
      if(!window[key]) {
          stillWaiting = true;
          break;
      }
    }
    return stillWaiting;
  }

  // Helper to run scripts at end of
  var runDeferredScript = function() {
    (function F() {
      if(stillWaitingForRequirements()) {
        setTimeout(F, 50);
      } else {
        var X = window[scriptUUID];
        Component.decodeTemplate(X.templates, X.scripts, X.styles);
      }
    })();
  }

  // Register templates, scripts, and styles for the component
  window[scriptUUID] = {
    templates: {{encodedTemplateTags}},
    scripts: {{encodedScriptTags}},
    styles: {{encodedStyleTags}}
  };

  // Priority load required scripts, if not alread in page
  for(var key in requiredScripts) {
    if(!window["Loading" + key] && typeof window[key] === 'undefined') {
      var path = requiredScripts[key];
      loadScript(key, path);
    }
  }

  // Defer the decoding and execution of the template
  runDeferredScript();

})();
