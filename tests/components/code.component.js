(function() {
  // The unique ID for this script
  var scriptUUID = "6763ce0b-50db-4470-a053-6d0dc603d28c";

  // A list of required scripts
  var requiredScripts = {
    "Component": "//cdn.rawgit.com/connected-web/web-component-js/1.2.2/lib/web-component.js",
    "hljs": "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js",
    "marked": "//cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"
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
    templates: ["%3Ctemplate%20for%3D%22code%22%3E%7B%7B%7Bcode%7D%7D%7D%3C%2Ftemplate%3E%20"],
    scripts: ["%3Cscript%20type%3D%22text%2Fjavascript%22%3E%20" + "%24(function()%20%7B%20" + "var%20replaceHtmlEntities%20%3D%20function(content)%20%7B%20" + "return%20String(content).replace(%2F%26%2Fg%2C%20'%26amp%3B').replace(%2F%3C%2Fg%2C%20'%26lt%3B').replace(%2F%3E%2Fg%2C%20'%26gt%3B').replace(%2F%22%2Fg%2C%20'%26quot%3B')%3B%20" + "%7D%3B%20" + "var%20replaceEntitiesWithHtml%20%3D%20function(content)%20%7B%20" + "return%20String(content).replace(%2F%26amp%3B%2Fg%2C%20'%26').replace(%2F%26lt%3B%2Fg%2C%20'%3C').replace(%2F%26gt%3B%2Fg%2C%20'%3E').replace(%2F%26quot%3B%2Fg%2C%20'%22')%3B%20" + "%7D%3B%20" + "%20" + "%24('pre%5Bcode%5D%2C%20code').html(function()%20%7B%20" + "return%20replaceHtmlEntities(this.innerHTML.toString())%3B%20" + "%7D)%3B%20" + "%20" + "var%20CodeComponent%20%3D%20Component.configure(%22code%22)%3B%20" + "%20" + "CodeComponent.on('preRenderStep'%2C%20function(instance)%20%7B%20" + "if(typeof%20hljs%20!%3D%3D%20%22undefined%22)%20%7B%20" + "var%20code%20%3D%20replaceEntitiesWithHtml(instance.content)%3B%20" + "instance.code%20%3D%20hljs.highlightAuto(code).value%3B%20" + "%7D%20" + "else%20%7B%20" + "instance.code%20%3D%20replaceHtmlEntities(instance.content)%3B%20" + "%7D%20" + "%7D)%3B%20" + "%20" + "CodeComponent.apply(function(instance)%20%7B%20" + "instance.render()%3B%20" + "%7D)%3B%20" + "%20" + "%7D)%3B%20" + "%3C%2Fscript%3E%20"],
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
