// Compile
var compiler = require('../web-component-js').compiler;
compiler.compile('./tests/compiler/source/*.component.html', './tests/compiler/build', compilationComplete);

function compilationComplete(error, success) {
  if (success) {
    console.log('Compilation succeeded', success);
    compare();
  } else {
    console.log('Compilation failed: ', error);
  }
}

function compare() {
  var dirdiff = require("dirdiff");

  dirdiff('tests/compiler/build', 'tests/compiler/canned', {
    fileContents: true
  }, function (error, diffs) {
    if (error) {
      console.log('Errors: ', error);
    } else if (diffs.length > 0) {
      console.log('Differences: ');
      console.log(diffs);
    } else {
      console.log('No differences found between canned and build directories.');
    }
  });
}
