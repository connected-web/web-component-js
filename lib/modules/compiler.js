var glob = require('glob');
var fs = require('fs');

var instance = {};

function compileComponent(inputFile, outputFile, callback) {
  console.log("Compiling " + outputFile + " from " + inputFile);
  var fileContents = fs.readFile(inputFile, {
    encoding: "utf8"
  }, function (error, data) {
    var success = false;
    if (data) {
      console.log("Loaded data for file: " + inputFile + " Length (" + data.length + ")");
      success = true;
    } else {
      error = (error || 'File was empty');
      console.log("Failed to compile: " + inputFile + " reason: " + error);
    }

    callback(error, success);
  });
}

instance.compile = function (sourceFilter, destination, callback) {
  sourceFilter = sourceFilter || "**/*component.html";
  destination = destination || "dist";

  console.log("Compiler is a work in progress: " + sourceFilter + ", " + destination);

  var report = {
    jobs: 0,
    successes: 0,
    failiures: 0
  }

  function createJobFor(file) {
    // Generate individual file paths
    var fileName = file.split('/').pop();
    console.log('File: ' + fileName);
    var destinationFile = destination + '/' + fileName.split('.').slice(0, -1).join('.') + ".js";

    // Force async
    setTimeout(function () {
      compileComponent(file, destinationFile, checkJobSuccess);
    }, 0);
  }

  function checkJobSuccess(error, success) {
    if (success) {
      report.successes++;
    } else {
      report.failiures++;
    }

    checkConditionsForCallback();
  }

  function checkConditionsForCallback() {
    if (report.jobs === report.successes) {
      callback(false, report);
    } else if (report.jobs === (report.successes + report.failiures)) {
      callback(report, false);
    }
  }

  glob(sourceFilter, {}, function (err, files) {
    // Track how many files need to be compiled
    report.jobs = files.length;

    // Set up a job to compiler each file
    files.map(createJobFor);
  });
}

module.exports = instance;
