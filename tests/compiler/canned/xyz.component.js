(function() {
  // The unique ID for this script
  var scriptUUID = "5ab018dc-01e5-4139-9d0d-69d06245d1e9";

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
    templates: ["%3Ctemplate%20for%3D%22xyz%22%3E%20" + "%3Cb%3E%7B%7Bdata-name%7D%7D%3C%2Fb%3E%20%3Ci%3E%7B%7Bcontent%7D%7D%3C%2Fi%3E%20" + "%3C%2Ftemplate%3E%20"],
    scripts: [],
    styles: ["%3Cstyle%20for%3D%22xyz%22%3E%20" + "xyz%20%7B%20" + "display%3A%20inline-block%3B%20" + "padding%3A%204px%208px%3B%20" + "background%3A%20%23AAA%3B%20" + "border-radius%3A%206px%3B%20" + "%7D%20" + "%3C%2Fstyle%3E%20"]
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
