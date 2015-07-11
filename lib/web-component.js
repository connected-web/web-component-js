// The actual library components:
var Component = false;
var ComponentDataSources = false;
var ComponentEvents = false;

(function() {
  // A list of required scripts
  var requiredScripts = {
    "jQuery": "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js",
    "Handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js"
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
  var runDeferredScript = function(callback) {
    (function F() {
      if(stillWaitingForRequirements()) {
        setTimeout(F, 50);
      } else {
        callback.apply(this, []);
      }
    })();
  }

  // Priority load required scripts, if not alread in page
  for(var key in requiredScripts) {
    if(!window["Loading" + key] || typeof window[key] === 'undefined') {
      var path = requiredScripts[key];
      loadScript(key, path);
    }
  }

  var Messages = {
    LIBRARY: "[Web Component]",
    INIT: "Initialising web component",
    DATA_SOURCE_UPDATE: "Updated data source status: ",
    WAITING_FOR_SERVER: "Waiting for server response",
    DATA_LOAD_SUCCESS: "Data load success",
    DATA_LOAD_FAILED: "Data load failed: ",
    DATA_RETURNED_ERROR: "Data returned error: ",
    DATA_UNEXPECTED_FORMAT: "Data returned in unexpected format: ",
    DATA_LOAD_COMPLETE_ON_MISSING_ELEMENT: "Data load completed on element that no longer exists in page.",
    PRE_RENDER_STARTED: "Pre-render started",
    RENDER_COMPLETE: "Render complete"
  };

  ComponentEvents = {
    "init": Messages.INIT,
    "dataSourceUpdate": Messages.DATA_SOURCE_UPDATE,
    "waitingForServer": Messages.WAITING_FOR_SERVER,
    "dataLoadSuccess": Messages.DATA_LOAD_SUCCESS,
    "dataLoadFailed": Messages.DATA_LOAD_FAILED,
    "dataReturnedError": Messages.DATA_RETURNED_ERROR,
    "dataUnexpectedFormat": Messages.DATA_UNEXPECTED_FORMAT,
    "dataLoadCompleteOnMissingElement": Messages.DATA_LOAD_COMPLETE_ON_MISSING_ELEMENT,
    "preRenderStep": Messages.PRE_RENDER_STARTED,
    "renderComplete": Messages.RENDER_COMPLETE
  }

  ComponentDataSources = (function () {
    var Class = function () {}

    Class.adapters = [];

    /* Register a callback function that takes function x(webComponent) { ... } as the adapter. */
    Class.register = function (adapter) {
      Class.adapters.push(adapter);
    }

    return Class;
  })();

  ComponentDataSources.register(function (webComponent) {
    // Do a fresh copy of attributes
    webComponent.copyAttributesFrom(webComponent.element);

    // extract pertinent information from the web component
    webComponent.dataSourceTemplate = webComponent["data-source-template"] || false;
    webComponent.dataSourceUrl = webComponent["data-source-url"] || Component.expandTemplate(webComponent, webComponent.dataSourceTemplate) || false;
    webComponent.dataSourceDataType = webComponent["data-source-type"] || false;
    webComponent.dataSourceData = false;
    webComponent.dataSourceError = false;

    // abandon out if no dataSourceUrl is available
    if (!webComponent.dataSourceUrl) {
      return false;
    }

    // let the world know we're waiting for the server
    webComponent.dispatchEvent("waitingForServer");

    // palm off to jQuery for a standard AJAX call
    $.ajax({
      url: this.dataSourceUrl,
      dataType: this.dataSourceDataType,
      success: function (data, textStatus) {
        webComponent.data = data;
        webComponent.dataSourceData = JSON.stringify(webComponent.data);
        if (data !== null && typeof data === 'object') {
          // copy data values onto object
          for (var property in data) {
            webComponent[property] = data[property];
          }

          // look for error property within data
          if (data.error) {
            webComponent.dataSourceError = data.error;
            webComponent.dispatchEvent("dataReturnedError");
          } else {
            // assume all was successful
            webComponent.dispatchEvent("dataLoadSuccess");
          }
        } else {
          // report that data was in an unexpected format
          webComponent.dispatchEvent("dataUnexpectedFormat");
        }
      }
    }).fail(function (jqXHR, textStatus) {
      // report a flat out fail
      webComponent.dataSourceError = textStatus;
      webComponent.dispatchEvent("dataLoadFailed");
    });

    return true;
  });

  Component = (function () {

    /* Class constants */

    var Class = function () {}

    Class.registeredComponents = {
      component: Class
    };

    /* Public interface */

    Class.configure = function (elementName) {
      if(!elementName) {
        Class.log("Falsey element name provided in configure method.", LogLevel.WARN);
        return;
      }

      var elementName = (elementName + "").toLowerCase();
      var ComponentClass = Class.registeredComponents[elementName] || false;
      if (ComponentClass) {
        return ComponentClass;
      } else {
        ComponentClass = Class.registerComponentClass(elementName);
      }
      return ComponentClass;
    }

    Class.registerComponentClass = function (elementName, template) {
      var ComponentClass = Component.create(elementName, template);
      Class.registeredComponents[elementName] = ComponentClass;
      return ComponentClass;
    }

    /* Individual Web Component defintion */

    Class.create = function (elementName, templateElement) {

      var ComponentClass = function (element) {
        this.construct(element);
      }

      ComponentClass.templateElement = templateElement;
      ComponentClass.registeredInstances = {};
      ComponentClass.events = {};
      ComponentClass.elementCounter = 0;

      ComponentClass.prototype.elementName = elementName;
      ComponentClass.prototype.templateName = elementName + '-template';
      ComponentClass.prototype.preRenderSteps = [];

      ComponentClass.registerInstance = function (instance) {
        ComponentClass.registeredInstances[instance.webComponentId] = instance;
      }

      ComponentClass.deregisterInstance = function (instance) {
        delete ComponentClass.registeredInstances[instance.webComponentId];
      }

      ComponentClass.on = function (eventName, callback) {
        var events = ComponentClass.events;
        if (events[eventName]) {
          Class.log("Registering additional event on " + eventName + " for " + elementName, LogLevel.INFO);
          events[eventName].push(callback);
        } else {
          Class.log("Registering event on " + eventName + " for " + elementName, LogLevel.INFO);
          events[eventName] = [callback];
        }
      };

      ComponentClass.prototype.dispatchEvent = function (eventName) {
        var events = ComponentClass.events;
        var callbackList = events[eventName];
        if (typeof callbackList === "object" && callbackList.length > 0) {
          for (var i = 0; i < callbackList.length; i++) {
            var callback = callbackList[i];
            if (typeof callback === "function") {
              callback.apply(this, [this]);
            }
          }
        }
      }

      ComponentClass.prototype.construct = function (element) {
        this.element = element;
        this.content = $(element).html().trim();
        this.templateKeyPreferred = "template[for={{elementName}}]".replace('{{elementName}}', elementName);
        this.templateKeyDeprecated = "template[tagname={{elementName}}]".replace('{{elementName}}', elementName);

        var preferredTemplate = $(this.templateKeyPreferred)[0];
        if (!preferredTemplate) {
          var deprecatedTemplate = $(this.templateKeyDeprecated)[0];
          if (deprecatedTemplate) {
            Class.log('DEPRECATION WARNING: The attribute tagName, e.g. <template tagName="{{elementName}}"> has been deprecated in favour of <template for="{{elementName}}">, and will be removed in web-component.js release 2.0.0. Please update your templates!'.replace(/{{elementName}}/g, elementName), LogLevel.WARN);
          }
        }
        this.template = templateElement || preferredTemplate || deprecatedTemplate || false;

        if (!this.template) {
          this.template = this.element.cloneNode(true);
          Class.log("Could not find template for " + this.elementName + ", using: " + $(this.template).html() + " instead.", LogLevel.WARN);
        }

        ComponentClass.elementCounter = ComponentClass.elementCounter + 1;
        this.webComponentId = this.elementName + "-" + ComponentClass.elementCounter;
        element.setAttribute('webComponentId', this.webComponentId);
        ComponentClass.registerInstance(this);

        // Copy attributes from template, then from element
        this.copyAttributesFrom(this.template);
        this.copyAttributesFrom(this.element);

        // Initialise the component
        this.dispatchEvent("init");
        this.init();

        // Refresh the data and redraw
        this.refresh();
      }

      // Register internal event handling for data
      ComponentClass.on("waitingForServer", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.WAITING_FOR_SERVER);
      });

      ComponentClass.on("dataReturnedError", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.DATA_RETURNED_ERROR + webComponent.dataSourceUrl + " : " + JSON.stringify(webComponent.dataSourceError));
      });

      ComponentClass.on("dataLoadError", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.DATA_LOAD_SUCCESS);
      });

      ComponentClass.on("dataUnexpectedFormat", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.DATA_UNEXPECTED_FORMAT + JSON.stringify(webComponent.data));
      });

      ComponentClass.on("dataLoadFailed", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.DATA_LOAD_FAILED + webComponent.dataSourceError);
      });

      ComponentClass.on("dataLoadSuccess", function (webComponent) {
        webComponent.updateDataSourceStatus(Messages.DATA_LOAD_SUCCESS);
      });

      ComponentClass.prototype.init = function () {
        // Override this method if you need to perform custom first time render steps
        this.render(Messages.INIT);
      }

      ComponentClass.prototype.copyAttributesFrom = function (element) {
        if (element && element.attributes) {
          for (var i = 0; i < element.attributes.length; i++) {
            var attribute = element.attributes[i];
            this[attribute.name] = attribute.value;
          }
        }
      }

      ComponentClass.prototype.preRenderStep = function (fn) {
        // Add your own using:
        // Component.register("tagName").preRenderStep(function() { ... });

        var steps = ComponentClass.prototype.preRenderSteps;
        if (fn) {
          Class.log('DEPRECATION WARNING: {{elementName}}.preRenderStep(fn); has been deprecated, and will be removed in release 2.0.0. Use {{elementName}}.on("preRenderStep", fn) instead to run custom events before the render code executes.'.replace(/{{elementName}}/g, elementName), LogLevel.WARN);
          steps.push(fn);
        } else {
          for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            step.apply(this, []);
          }
        }
        return ComponentClass;
      }

      ComponentClass.prototype.requestDataFromSource = function () {
        if (typeof ComponentDataSources !== "undefined" && ComponentDataSources.adapters) {
          var list = ComponentDataSources.adapters;
          for (var i = 0; i < list.length; i++) {
            var adapter = list[i];
            adapter.apply(this, [this]);
          }
        }
      }

      ComponentClass.prototype.updateDataSourceStatus = function (message) {
        var existsInPage = Class.existsInPage(this.element);
        if (existsInPage) {
          this.dataSourceStatus = message;
          this.render(Messages.DATA_SOURCE_UPDATE + message);
          this.dispatchEvent("dataSourceUpdate");
        } else {
          Class.log(Messages.DATA_LOAD_COMPLETE_ON_MISSING_ELEMENT, LogLevel.INFO);
          this.dispatchEvent("dataLoadCompleteOnMissingElement");
          ComponentClass.deregisterInstance(this);
        }
      }

      ComponentClass.prototype.render = function (reason) {
        var reason = reason || false;

        this.dispatchEvent("preRenderStep");

        this.preRenderStep();

        Class.log(Class.tab() + "<" + this.webComponentId + "> " + reason, LogLevel.RENDER);

        // Use handlebars to expand template
        var expandedTemplate = Component.expandTemplate(this, $(this.template).html());

        // Remove script and style tags from parsed template
        var display = document.createElement('div');
        display.innerHTML = expandedTemplate;
        $('script', display).remove();
        $('style', display).remove();

        // Render and rescan component
        $(this.element).html(display.innerHTML).attr('rendered', true);
        Class.scanForComponents(this.element);

        Class.log(Class.tab() + "</" + this.webComponentId + "> " + reason, LogLevel.RENDER);

        this.dispatchEvent("renderComplete");
      }

      ComponentClass.prototype.refresh = function () {
        // Prevent timeout leaks
        if (this.refreshTimeoutId) {
          clearTimeout(this.refreshTimeoutId);
        }

        // Check if element still exists in the visible DOM
        var existsInPage = Class.existsInPage(this.element);
        if (existsInPage) {
          // Loop the the refresh if refresh time is set
          var self = this;
          this.refreshTimeSeconds = this["refresh-time"] || 0;
          if (this.refreshTimeSeconds) {
            this.refreshTimeoutId = setTimeout(function () {
              self.refresh();
            }, this.refreshTimeSeconds * 1000 + Math.random() * 500);
          }

          // Re-load data for the component
          this.requestDataFromSource();
        } else {
          ComponentClass.deregisterInstance(this);
        }
      }

      ComponentClass.apply = function (fn) {
        // Apply fn to all instances of ComponentClass
        var instances = ComponentClass.registeredInstances;
        for (id in instances) {
          var instance = instances[id];
          fn.apply(instance, [instance]);
        }
      }

      return ComponentClass;
    }

    /* Utility methods */

    Class.expandTemplate = function (data, template) {
      if (template) {

        // substitute element content into template
        if (data.content) {
          template = template.replace(/{{content}}/g, data.content);
        }

        // apply handlebar template based on context
        var handlebarsTemplate = Handlebars.compile(template);
        var expandedTemplate = handlebarsTemplate(data);
      }
      return expandedTemplate;
    }

    Class.tab = function () {
      var tab = "";
      for (var i = 0; i < Class.scanLevel; i++)
        tab += "  ";

      return tab;
    }

    Class.existsInPage = function (node) {
      return (node === document.body) ? false : document.body.contains(node);
    }

    var LogLevel = {
      types: {
        0: "off",
        1: "warn",
        2: "info",
        3: "render"
      },
      OFF: 0,
      WARN: 1,
      INFO: 2,
      RENDER: 3
    };

    Class.log = function (message, level) {
      level = level || LogLevel.RENDER;
      if (Class.logLevelValue >= level) {
        var type = LogLevel.types[level] || "unknown";
        console.log(Messages.LIBRARY + " [" + type + "] " + message);
      }
    }

    Class.LogLevel = LogLevel;
    Class.logLevelValue = false;
    Class.logLevel = function (value) {
      var type = typeof value;
      Class.logLevelValue = (typeof LogLevel.types[value] === "string") ? value : 0;
      Class.log("Log level set to [" + LogLevel.types[Class.logLevelValue] + "] based on value " + Class.logLevelValue, LogLevel.INFO);
    };
    Class.logLevel(LogLevel.WARN);

    /* Global boot up */
    Class.queuedItems = [];
    Class.processQueuedItems = function() {
      var list = Class.queuedItems;
      while(list.length > 0) {
        var item = list.pop();
        Class.log("Applying item " + list.length + " from queued item list.", LogLevel.INFO);
        item.apply(this, []);
        Class.log("Applied item " + list.length + " from queued item list.", LogLevel.INFO);
      }
    }

    Class.encodeHtmlForJavaScript = function(html) {
      return encodeURIComponent(html);
    }

    Class.decodeInto = function(value, holder) {
      var decoded = decodeURIComponent(value);
      $(holder).append($(decoded));
    }

    Class.decodeTemplate = function(encodedTemplateTags, encodedScriptTags, encodedStyleTags) {
      var planOfAction = function() {
        var holder = document.createElement('div');
        // Templates
        encodedTemplateTags.forEach(function(item) {
          Class.decodeInto(item, holder);
        });
        // Styles
        encodedStyleTags.forEach(function(item) {
          Class.decodeInto(item, holder);
        });
        // Attach to document
        document.body.appendChild(holder);

        // Register and scan for components
        Class.registerTemplates(holder).scanForComponents();

        // Execute scripts
        encodedScriptTags.forEach(function(item) {
          Class.decodeInto(item, holder);
        });
      };

      // Delay execution of this plan if depdendencies haven't loaded yet
      Class.log("Adding decodeTemplate instruction to queued item list.", LogLevel.INFO);
      if(Class.ready) {
        planOfAction();
      }
      else {
        Class.queuedItems.push(planOfAction);
      }
    };

    Class.registerTemplates = function (rootElement) {
      // Apply default values
      rootElement = rootElement || document.body;

      var templates = $('template[for], template[tagname]', rootElement).each(function () {
        var template = this;
        var elementName = $(this).attr('for') || $(this).attr('tagname');

        Class.registerComponentClass(elementName, template);
        if(template.parentElement) {
          template.parentElement.removeChild(template);
        }
      });

      return this;
    };

    Class.scanLevel = 0;
    Class.scanForComponents = function (rootElement, type, reRender) {
      // Apply default values
      rootElement = rootElement || document.body;
      type = type || "*";
      reRender = reRender || false;

      Class.scanLevel++;
      var items = rootElement.getElementsByTagName("*");
      // Walk the document looking for components to create
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        var elementName = element.tagName.toLowerCase();
        // Check that element has not already been wrapped and rendered
        if (!element.attributes.rendered) {
          var ComponentClass = Class.registeredComponents[elementName] || false;
          if (ComponentClass) {
            new ComponentClass(element);
          }
        }
      }
      Class.scanLevel--;

      return this;
    }

    return Class;
  })();

  // Defer the execution of the component
  runDeferredScript(function() {
    $(function() {
      Component.ready = true;
      Component.registerTemplates().scanForComponents(document.body);
      Component.processQueuedItems();
    });
  });
})();
