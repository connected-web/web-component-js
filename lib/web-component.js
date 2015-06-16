if (typeof jQuery === 'undefined') {
  var suggestedCDN = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js";
  throw new Error('Web Component\'s JavaScript requires jQuery, please include the following into your page: ' + suggestedCDN);
}

if (typeof Handlebars === 'undefined') {
  var suggestedCDN = "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.js";
  throw new Error('Web Component\'s JavaScript requires Handlebars, please include the following into your page: ' + suggestedCDN);
}

var Component = false;

// Component requires jQuery for AJAX calls to data-source-url's defined on components
$(function() {
  Component = (function() {

    /* Class constants */

    var Messages = {
      LIBRARY: "[Web Component]",
      INIT: "Initialising web component",
      DATA_SOURCE_UPDATE: "Updated data source status: ",
      WAITING_FOR_SERVER: "Waiting for server response",
      DATA_LOADED_OK: "Data loaded OK",
      DATA_RETURNED_ERROR: "Data returned error: ",
      DATA_UNEXPECTED_FORMAT: "Data returned in unexpected format: ",
      DATA_LOAD_FAILED: "Data load failed: ",
      DATA_LOAD_COMPLETE_ON_MISSING_ELEMENT: "Data load completed on element that no longer exists in page."
    };

    var Class = function() {}

    Class.registeredComponents = {
      component: Class
    };

    /* Public interface */

    Class.configure = function(elementName) {
      var ComponentClass = Class.registeredComponents[elementName] || false;
      if (ComponentClass) {
        return ComponentClass;
      } else {
        ComponentClass = Class.registerComponent(elementName);
      }
      return ComponentClass;
    }

    Class.registerComponent = function(elementName, template) {
      var ComponentClass = Component.create(elementName, template);
      Class.registeredComponents[elementName] = ComponentClass;
      return ComponentClass;
    }

    /* Individual Web Component defintion */

    Class.create = function(elementName, templateElement) {

      var ComponentClass = function(element) {
        this.construct(element);
      }

      ComponentClass.elementCounter = 0;
      ComponentClass.prototype.elementName = elementName;
      ComponentClass.prototype.templateName = elementName + '-template';

      ComponentClass.prototype.construct = function(element) {
        this.element = element;
        this.content = $(element).html().trim();
        this.templateKeyPreferred = "template[for={{elementName}}]".replace('{{elementName}}', elementName);
        this.templateKeyDeprecated = "template[tagname={{elementName}}]".replace('{{elementName}}', elementName);

        var preferredTemplate = $(this.templateKeyPreferred)[0];
        if(!preferredTemplate) {
          var deprecatedTemplate = $(this.templateKeyDeprecated)[0];
          if(deprecatedTemplate) {
            Class.log('The attribute tagName, e.g. <template tagName="{{elementName}}"> will be deprecated in favour of <template for="{{elementName}}"> in web-component.js release 2.0.0. Please update your templates!'.replace(/{{elementName}}/g, elementName), LogLevel.WARN);
          }
        }
        this.template = templateElement || preferredTemplate || deprecatedTemplate || false;

        if (!this.template) {
          this.template = this.element.cloneNode(true);
          Class.log("Could not find template for " + this.elementName + ", using: " + $(this.template).html() + " instead.", LogLevel.WARN);
        }

        ComponentClass.elementCounter = ComponentClass.elementCounter + 1;
        this.webComponentId = this.elementName + "-" + ComponentClass.elementCounter;

        this.copyAttributesFrom(this.template);
        this.copyAttributesFrom(this.element);

        this.init();
        this.refresh();
      }

      ComponentClass.prototype.init = function() {
        // Override this method if you need to perform custom first time render steps
        this.render(Messages.INIT);
      }

      ComponentClass.prototype.copyAttributesFrom = function(element) {
        if (element && element.attributes) {
          for (var i = 0; i < element.attributes.length; i++) {
            var attribute = element.attributes[i];
            this[attribute.name] = attribute.value;
          }
        }
      }

      ComponentClass.prototype.preRenderSteps = [];
      ComponentClass.prototype.preRenderStep = function(fn) {
        // Add your own using:
        // Component.register("tagName").preRenderStep(function() { ... });

        var steps = ComponentClass.prototype.preRenderSteps;
        if (fn) {
          steps.push(fn);
        } else {
          for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            step.apply(this, []);
          }
        }
        return ComponentClass;
      }

      ComponentClass.prototype.requestDataFromSource = function() {
        var self = this;

        this.dataSourceTemplate = this["data-source-template"] || false;
        this.dataSourceUrl = this["data-source-url"] || ComponentClass.expandTemplate(this, this.dataSourceTemplate) || false;
        this.dataSourceDataType = this["data-source-type"] || false;
        this.dataSourceData = false;
        this.dataSourceError = false;

        if (!this.dataSourceUrl) {
          return false;
        }

        this.updateDataSourceStatus(Messages.WAITING_FOR_SERVER);

        $.ajax({
          url: this.dataSourceUrl,
          dataType: this.dataSourceDataType,
          success: function(data, textStatus) {
            self.data = data;
            self.dataSourceData = JSON.stringify(self.data);
            if (data !== null && typeof data === 'object') {
              for (var property in data) {
                self[property] = data[property];
              }
              if (data.error) {
                self.dataSourceError = data.error;
                self.updateDataSourceStatus(Messages.DATA_RETURNED_ERROR + self.dataSourceUrl + " : " + JSON.stringify(data.error));
              } else {
                self.updateDataSourceStatus(Messages.DATA_LOADED_OK);
              }
            } else {
              self.updateDataSourceStatus(Messages.DATA_UNEXPECTED_FORMAT + JSON.stringify(data));
            }
          }
        }).fail(function(jqXHR, textStatus) {
          self.dataSourceError = true;
          self.updateDataSourceStatus(Messages.DATA_LOAD_FAILED + textStatus);
        });
      }

      ComponentClass.prototype.updateDataSourceStatus = function(message) {
        var existsInPage = Class.existsInPage(this.element);
        if (existsInPage) {
          this.dataSourceStatus = message;
          this.render(Messages.DATA_SOURCE_UPDATE + message);
        } else {
          Class.log(Messages.DATA_LOAD_COMPLETE_ON_MISSING_ELEMENT, LogLevel.INFO);
        }
      }

      ComponentClass.prototype.render = function(reason) {
        var reason = reason || false;
        this.preRenderStep();

        Class.log(Class.tab() + "<" + this.webComponentId + "> " + reason, LogLevel.RENDER);

        var expandedTemplate = ComponentClass.expandTemplate(this, $(this.template).html());
        $(this.element).html(expandedTemplate).attr('rendered', true);
        Class.scanForComponents(this.element);

        Class.log(Class.tab() + "</" + this.webComponentId + "> " + reason, LogLevel.RENDER);
      }

      ComponentClass.expandTemplate = function(data, template) {
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

      ComponentClass.expandProperty = function(property, value, template) {
        var expandedTemplate = template;

        if (expandedTemplate) {
          var matcher = new RegExp("{{x}}".replace("x", property), "g");
          expandedTemplate = expandedTemplate.replace(matcher, value);
        }

        return expandedTemplate;
      }

      ComponentClass.prototype.refresh = function() {
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
            this.refreshTimeoutId = setTimeout(function() {
              self.refresh();
            }, this.refreshTimeSeconds * 1000 + Math.random() * 500);
          }

          // Re-load data for the component
          this.requestDataFromSource();
        }
      }

      return ComponentClass;
    }

    /* Utility methods */

    Class.tab = function() {
      var tab = "";
      for (var i = 0; i < Class.scanLevel; i++)
        tab += "  ";

      return tab;
    }

    Class.existsInPage = function(node) {
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

    Class.log = function(message, level) {
      level = level || LogLevel.RENDER;
      if (Class.logLevelValue >= level) {
        var type = LogLevel.types[level] || "unknown";
        console.log(Messages.LIBRARY + " [" + type + "] " + message);
      }
    }

    Class.LogLevel = LogLevel;
    Class.logLevelValue = LogLevel.WARN;
    Class.logLevel = function(value) {
      var type = typeof value;
      Class.logLevelValue = (typeof LogLevel.types[value] === "string") ? value : 0;
      Class.log("Log level set to [" + LogLevel.types[Class.logLevelValue] + "] based on value " + Class.logLevelValue, LogLevel.INFO);
    }

    Class.logLevel(LogLevel.WARN);

    /* Global boot up */

    Class.registerTemplates = function() {
      var templates = $('template[for], template[tagname]').each(function() {
        var template = $(this)[0];
        var elementName = $(this).attr('for') || $(this).attr('tagname');

        Class.registerComponent(elementName, template);
      });

      return this;
    }

    Class.scanLevel = 0;
    Class.scanForComponents = function(rootElement) {
      rootElement = rootElement || document.body;
      Class.scanLevel++;
      var items = rootElement.getElementsByTagName("*");
      // Walk the document looking for components to create
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        var elementName = element.tagName.toLowerCase();
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

  Component.registerTemplates().scanForComponents(document.body);
});
