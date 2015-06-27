if (typeof Component === 'undefined') {
  var suggestedSource = "https://github.com/Markavian/web-component"
  throw new Error('This script requires Web Component JS defined in the page, please see: ' + suggestedSource + ' for more information.');
}
$(function() {
  // Templates
  var encodedTemplateTags = ["%3Ctemplate%20for%3D%22xyz%22%3E" +
"%3Cp%3E%3Cb%3E%7B%7Bdata-name%7D%7D%3C%2Fb%3E%2C%20%3Ci%3E%7B%7Bcontent%7D%7D%20%7B%7Bspecial%7D%7D%3C%2Fi%3E%3C%2Fp%3E" +
"%3C%2Ftemplate%3E"];
  // Scripts
  var encodedScriptTags = ["%3Cscript%20for%3D%22xyz%22%20type%3D%22text%2Fjavascript%22%3E" +
"%24(function()%20%7B" +
"var%20XyzComponent%20%3D%20Component.configure('xyz')%3B" +
"XyzComponent.on('preRenderStep'%2C%20function(instance)%20%7B" +
"if%20(instance%5B%22data-name%22%5D%20%3D%3D%20%22George%22)%20%7B" +
"instance.special%20%3D%20%22George%20gets%20special%20content.%22%3B" +
"%7D" +
"%7D)%3B" +
"XyzComponent.apply(function(instance)%20%7B" +
"instance.render()%3B" +
"%7D)%3B" +
"%7D)%3B" + 
"%3C%2Fscript%3E"];
  // Styles
  var encodedStyleTags = ["%3Cstyle%20for%3D%22xyz%22%3E" +
"xyz%20%3E%20p%20%7B" +
"display%3A%20inline-block%3B" +
"border-radius%3A%205px%3B" +
"margin%3A%200%205px%2010px%200%3B" +
"padding%3A%205px%3B" +
"background%3A%20%23CDF%3B" +
"%7D" +
"%3C%2Fstyle%3E"];
  Component.decodeTemplate(encodedTemplateTags, encodedScriptTags, encodedStyleTags);
});
