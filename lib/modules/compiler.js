var glob = require('glob');
var fs = require('fs');

var instance = {};

function compileComponent(inputFile, outputFile) {
  console.log("Compiling " + outputFile + " from " + inputFile);
  var outputFile = inputFile + ".js";
  var fileContents = fs.readFile(inputFile, {encoding: "utf8"}, function(error, data) {
    if(error) {
      console.log("Failed to compile: " + inputFile + " reason: " + error);
    }
    else if(data) {
      console.log("Loaded data for file: " + inputFile + " Length (" + data.length + ")");
    }
    else {
      console.log("Failed to compile: " + inputFile + " was empty.");
    }
  });
}

instance.compile = function(sourceFilter, destination) {
  sourceFilter = "**/*component.html";
  destination = destination || "dist";

  console.log("Compiler is a work in progress: " + sourceFilter + ", " + destination);

  glob(sourceFilter, {}, function (err, files) {
    files.map(function(file) {
      var destinationFile = file.split('.').slice(0, -1).join('.') + ".js";
      compileComponent(file, destinationFile);
    });
  })

}

module.exports = instance;
