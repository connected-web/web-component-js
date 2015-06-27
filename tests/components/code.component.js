if (typeof Component === 'undefined') {
  var suggestedSource = "https://github.com/Markavian/web-component"
  throw new Error('This script requires Web Component JS defined in the page, please see: ' + suggestedSource + ' for more information.');
}
$(function () {
  // Templates
  var encodedTemplateTags = ["%3Ctemplate%20for%3D%22code%22%3E%7B%7B%7Bcode%7D%7D%7D%3C%2Ftemplate%3E"];
  // Scripts
  var encodedScriptTags = ["%3Cscript%20type%3D%22text%2Fjavascript%22%3E" +
    "%24(function()%20%7B" +
    "var%20replaceHtmlEntities%20%3D%20function(content)%20%7B" +
    "return%20String(content).replace(%2F%26%2Fg%2C%20'%26amp%3B').replace(%2F%3C%2Fg%2C%20'%26lt%3B').replace(%2F%3E%2Fg%2C%20'%26gt%3B').replace(%2F%22%2Fg%2C%20'%26quot%3B')%3B" +
    "%7D%3B" +
    "" +
    "var%20replaceEntitiesWithHtml%20%3D%20function(content)%20%7B" +
    "return%20String(content).replace(%2F%26amp%3B%2Fg%2C%20'%26').replace(%2F%26lt%3B%2Fg%2C%20'%3C').replace(%2F%26gt%3B%2Fg%2C%20'%3E').replace(%2F%26quot%3B%2Fg%2C%20'%22')%3B" +
    "%7D%3B" +
    "" +
    "%24('pre%5Bcode%5D%2C%20code').html(function()%20%7B" +
    "return%20replaceHtmlEntities(this.innerHTML.toString())%3B" +
    "%7D)%3B" +
    "" +
    "var%20CodeComponent%20%3D%20Component.configure(%22code%22)%3B" +
    "CodeComponent.on('preRenderStep'%2C%20function(instance)%20%7B" +
    "if%20(typeof%20hljs%20!%3D%3D%20%22undefined%22)%20%7B" +
    "%2F*%20Use%20code%20highlighting%20with%20highlight.js%20*%2F" +
    "var%20code%20%3D%20replaceEntitiesWithHtml(instance.content)%3B" +
    "instance.code%20%3D%20hljs.highlightAuto(code).value%3B" +
    "%7D%20else%20%7B" +
    "%2F*%20Replace%20out%20odd%20characters%20from%20inside%20%3Ccode%3E%20blocks%20*%2F" +
    "instance.code%20%3D%20replaceHtmlEntities(instance.content)%3B" +
    "%7D" +
    "%7D)%3B" +
    "" +
    "CodeComponent.apply(function(instance)%20%7B" +
    "instance.render()%3B" +
    "%7D)%3B" +
    "%7D)%3B" +
    "%3C%2Fscript%3E"
  ];
  // Styles
  var encodedStyleTags = [];
  Component.decodeTemplate(encodedTemplateTags, encodedScriptTags, encodedStyleTags);
});
