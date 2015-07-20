var cheerio = require('cheerio');
var fs = require('fs');
var autoloaderTemplate = fs.readFileSync(__dirname + '/autoloader.template.js', 'utf8');
var NL = '\n';

module.exports = function (html, fileName) {
  var js = '';

  // Decode the incoming HTML
  $ = cheerio.load(html, {
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: false
  });

  // Extract Script tags, CSS styles, and Templates
  var scripts = $.html('script');
  var styles = $.html('style');
  var templates = $.html('template');

  // TODO: Replace encoded parts in template
  // {{encodedTemplateTags}}
  // {{encodedScriptTags}}
  // {{encodedStyleTags}}

  // Join it all together
  js = js + (scripts || '') + NL;
  js = js + (styles || '') + NL;
  js = js + (templates || '') + NL;

  return js;
}
