var glob = require('glob');
var fs = require('fs');

var instance = {};

instance.compile = function (sourceFilter, destination, callback, update) {
  sourceFilter = sourceFilter || '**/*component.html';
  destination = destination || 'dist';

  var report = {
    jobs: 0,
    successes: 0,
    failiures: 0
  }

  function sendUpdate(message, type) {
    if(typeof update === 'function') {
      update(message, type);
    }
  }

  sendUpdate('Compiler is a work in progress: ' + sourceFilter + ', ' + destination, 'info');

  function createJobFor(file) {
    // Generate individual file paths
    var fileName = file.split('/').pop();
    sendUpdate('File: ' + fileName, 'plain');
    var destinationFile = destination + '/' + fileName.split('.').slice(0, -1).join('.') + '.js';

    // Force async
    setTimeout(function () {
      compileComponent(file, destinationFile, checkJobSuccess);
    }, 0);
  }

  function compileComponent(inputFile, outputFile, callback) {
    sendUpdate('Compiling ' + outputFile + ' from ' + inputFile, 'warning');
    var fileContents = fs.readFile(inputFile, {
      encoding: 'utf8'
    }, function (error, data) {
      var success = false;
      if (data) {
        sendUpdate('Loaded data for file: ' + inputFile + ' Length (' + data.length + ')', 'info');
        success = true;
      } else {
        error = (error || 'File was empty');
        sendUpdate('Failed to compile: ' + inputFile + ' reason: ' + error, 'error');
      }

      callback(error, success);
    });
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
