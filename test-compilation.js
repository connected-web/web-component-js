// Colors
var colors = require('colors');

// Compile
var compiler = require('../web-component-js').compiler;
compiler.compile('./tests/compiler/source/*.component.html', './tests/compiler/build', compilationComplete, onUpdate);

function compilationComplete(error, success) {
  if (success) {
    console.log('Compilation succeeded'.green, success);
    compare();
  } else {
    console.log('Compilation failed: '.red, error);
  }
}

function onUpdate(message, type) {
  var color = {
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    success: 'green',
    plain: 'white'
  }[type] || 'grey';
  console.log(message[color]);
}

function compare() {
  var dirdiff = require("dirdiff");

  dirdiff('tests/compiler/build', 'tests/compiler/canned', {
    fileContents: true
  }, function (error, diffs) {
    if (error) {
      console.log('Errors: '.red, error);
    } else if (diffs.length > 0) {
      console.log('Differences found between canned and compiled files: '.red);
      console.log(diffs);
    } else {
      console.log('No differences found between canned and build directories.'.green);
    }
  });
}
