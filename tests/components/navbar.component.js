(function() {
  // The unique ID for this script
  var scriptUUID = "b9475cd5-849b-45b8-8b47-2c56da0e9004";

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
    templates: ["%3Ctemplate%20for%3D%22navbar%22%3E%20" + "%3Cb%3ENavigation%3A%3C%2Fb%3E%20%7B%7B%23each%20items%7D%7D%20" + "%3Cnavbar-item%20href%3D%22%7B%7Bhref%7D%7D%22%3E%7B%7BlinkText%7D%7D%3C%2Fnavbar-item%3E%20" + "%7B%7B%2Feach%7D%7D%20" + "%3C%2Ftemplate%3E%20", "%3Ctemplate%20for%3D%22navbar-item%22%3E%20" + "%3Ca%20href%3D%22%7B%7Bhref%7D%7D%22%3E%7B%7Bcontent%7D%7D%3C%2Fa%3E%20" + "%3C%2Ftemplate%3E%20"],
    scripts: [],
    styles: ["%3Cstyle%20for%3D%22navbar%22%3E%20" + "navbar%20%7B%20" + "display%3A%20block%3B%20" + "background%3A%20%23CCC%3B%20" + "border-radius%3A%202px%3B%20" + "padding%3A%205px%3B%20" + "font-size%3A%2014px%3B%20" + "line-height%3A%201.1%3B%20" + "%7D%20" + "%20" + "navbar-item%20%7B%20" + "display%3A%20inline-block%3B%20" + "background%3A%20%23EEE%3B%20" + "padding%3A%205px%3B%20" + "border-radius%3A%208px%3B%20" + "margin%3A%202px%3B%20" + "%7D%20" + "%20" + "navbar-item%20%3E%20a%20%7B%20" + "text-decoration%3A%20none%3B%20" + "%7D%20" + "%20" + "navbar-item%20%3E%20a%20%7B%20" + "color%3A%20%23337ab7%3B%20" + "text-decoration%3A%20none%20" + "%7D%20" + "%20" + "navbar-item%20%3E%20a%3Afocus%2C%20" + "navbar-item%20%3E%20a%3Ahover%20%7B%20" + "color%3A%20%2323527c%3B%20" + "text-decoration%3A%20underline%20" + "%7D%20" + "%20" + "navbar-item%20%3E%20a%3Afocus%20%7B%20" + "outline%3A%20thin%20dotted%3B%20" + "outline%3A%205px%20auto%20-webkit-focus-ring-color%3B%20" + "outline-offset%3A%20-2px%20" + "%7D%20" + "%3C%2Fstyle%3E%20"]
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
