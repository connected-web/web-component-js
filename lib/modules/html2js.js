var cheerio = require('cheerio');
var fs = require('fs');
var autoloaderTemplate = fs.readFileSync(__dirname + '/autoloader.template.js', 'utf8');
var NL = '\n';

function wrap(html) {
  var encoded = encodeHtmlAsJavaScriptString(html);
  var list = [encoded];
  return "[" + list.join(", ") + "]";
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function encodeHtmlAsJavaScriptString(html) {
  var NL = "\n";
  var lines = html.split(NL);
  var result = "";
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim() + " ";
    if (line.substring(0, 2) != "//") {
      result += '"' + encodeURIComponent(line) + '"';
      if (i < lines.length - 1) {
        result += " + ";
      }
    }
  }
  result = result.replace(/%20%20/g, '');
  return result;
}

module.exports = function (html, fileName) {
  var js = '';

  // Decode the incoming HTML
  $ = cheerio.load(html, {
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: false
  });

  // Extract Script tags, CSS styles, and Templates
  var scriptUUID = generateUUID();
  var templates = $.html('template');
  var scripts = $.html('script');
  var styles = $.html('style');

  // TODO: Replace encoded parts in template
  // {{scriptUUID}}
  // {{encodedTemplateTags}}
  // {{encodedScriptTags}}
  // {{encodedStyleTags}}

  /*
    var templateData = [];
    templates.each(function (key, value) {
      var fragmentString = CreateAWebComponent.getHTML(value, true);
      var fragment = CreateAWebComponent.encodeHtmlAsJavaScriptString(fragmentString);
      templateData.push(fragment);
    });
    var encodedTemplateTags = "[" + templateData.join(", ") + "]";

    var scriptData = [];
    scripts.each(function (key, value) {
      var fragmentString = CreateAWebComponent.getHTML(value, true);
      var fragment = CreateAWebComponent.encodeHtmlAsJavaScriptString(fragmentString);
      scriptData.push(fragment);
    });
    var encodedScriptTags = "[" + scriptData.join(", ") + "]";

    var styleData = [];
    styles.each(function (key, value) {
      var fragmentString = CreateAWebComponent.getHTML(value, true);
      var fragment = CreateAWebComponent.encodeHtmlAsJavaScriptString(fragmentString);
      styleData.push(fragment);
    });
    var encodedStyleTags = "[" + styleData.join(", ") + "]";
  */

  // Join it all together
  js = autoloaderTemplate
    .replace('{{scriptUUID}}', scriptUUID)
    .replace('{{encodedTemplateTags}}', wrap(templates))
    .replace('{{encodedScriptTags}}', wrap(scripts))
    .replace('{{encodedStyleTags}}', wrap(styles));

  return js;
}
