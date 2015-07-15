(function() {
  // The unique ID for this script
  var scriptUUID = "d486b93e-ddf5-4643-96d0-479af1b3ebe1";

  // A list of required scripts
  var requiredScripts = {
    "Component": "https://cdn.rawgit.com/connected-web/web-component-js/1.2.1/lib/web-component.js"
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
    templates: ["%3Ctemplate%20for%3D%22codeblock%22%3E%20" + "%3Cpre%3E%3Ccode%3E%7B%7BdivContents%7D%7D%3C%2Fcode%3E%3C%2Fpre%3E%20" + "%3C%2Ftemplate%3E%20"],
    scripts: ["%3Cscript%20for%3D%22codeblock%22%3E%20" + "%24(function()%20%7B%20" + "var%20CodeBlockComponent%20%3D%20Component.configure(%22codeblock%22)%3B%20" + "%20" + "CodeBlockComponent.on('preRenderStep'%2C%20function(instance)%20%7B%20" + "var%20targetId%20%3D%20instance%5B'from-target'%5D%3B%20" + "var%20targetElement%20%3D%20document.getElementById(targetId)%3B%20" + "if(targetElement)%20%7B%20" + "instance.divContents%20%3D%20targetElement.innerHTML%3B%20" + "%7D%20" + "else%20%7B%20" + "instance.divContents%20%3D%20%22Element%3A%20%22%20%2B%20targetId%20%2B%20%22%20not%20found%22%3B%20" + "%7D%20" + "%7D)%3B%20" + "%20" + "CodeBlockComponent.apply(function%20(instance)%20%7B%20" + "instance.render()%3B%20" + "%7D)%3B%20" + "%20" + "%7D)%3B%20" + "%20" + "%3C%2Fscript%3E%20"],
    styles: []
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
