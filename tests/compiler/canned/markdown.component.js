(function() {
  // The unique ID for this script
  var scriptUUID = "b3236fe8-201b-4c92-bff7-aa9d98b08817";

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
    templates: ["%3Ctemplate%20for%3D%22markdown%22%3E%7B%7B%7Bmarkdown%7D%7D%7D%3C%2Ftemplate%3E"],
    scripts: ["%3Cscript%20type%3D%22text%2Fjavascript%22%3E" + "%24(function()%20%7B" + "var%20MarkdownComponent%20%3D%20Component.configure(%22markdown%22)%3B" + "" + "MarkdownComponent.on('preRenderStep'%2C%20function(instance)%20%7B" + "if(typeof%20marked%20%3D%3D%3D%20%22undefined%22)%20%7B" + "var%20suggestedCDN%20%3D%20%22https%3A%2F%2Fcdnjs.cloudflare.com%2Fajax%2Flibs%2Fmarked%2F0.3.2%2Fmarked.min.js%22%3B" + "marked%20%3D%20function()%20%7B" + "return%20'This%20markdown%20component%20requires%20the%20JavaScript%20marked%20library%2C%20please%20include%20the%20following%20into%20your%20page%3A%20'%20%2B%20suggestedCDN%3B" + "%7D" + "%7D" + "" + "instance.markdown%20%3D%20marked(instance.content)%3B" + "%7D)%3B" + "" + "MarkdownComponent.on('renderComplete'%2C%20function(instance)%20%7B" + "%24('pre'%2C%20instance.element).addClass('hljs')%3B" + "%7D)%3B" + "" + "MarkdownComponent.apply(function(instance)%20%7B" + "instance.render()%3B" + "%7D)%3B" + "%7D)%3B" + "" + "%3C%2Fscript%3E"],
    styles: ["%3Cstyle%20for%3D%22markdown%22%3E" + "markdown%20%7B" + "white-space%3A%20pre%3B" + "display%3A%20block%3B" + "unicode-bidi%3A%20embed%3B" + "%7D" + "markdown%5Brendered%5D%20%7B" + "white-space%3A%20normal%3B" + "%7D" + "markdown%20%3E%20table%20%7B" + "border-spacing%3A%201px%3B" + "border-collapse%3A%20separate%3B" + "margin%3A%200%200%2010px%3B" + "%7D" + "" + "markdown%20%3E%20table%20%3E%20thead%20%3E%20tr%20%3E%20th%20%7B" + "padding%3A%206px%3B" + "%7D" + "" + "markdown%20%3E%20table%20%3E%20tbody%20%3E%20tr%20%3E%20td%20%7B" + "padding%3A%206px%3B" + "%7D" + "%3C%2Fstyle%3E"]
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
