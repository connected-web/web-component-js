var glob = require('glob');
var fs = require('fs');
var compileComponent = require('./html2js')

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
    sendUpdate('Found file: ' + fileName, 'plain');
    var destinationFile = destination + '/' + fileName.split('.').slice(0, -1).join('.') + '.js';

    // Force async
    setTimeout(function () {
      readAndWrite(file, destinationFile, compileComponent, checkJobSuccess);
    }, 0);
  }

  function readAndWrite(inputFile, outputFile, compileFunction, callback) {
    sendUpdate('Compiling ' + outputFile + ' from ' + inputFile, 'warning');
    var fileContents = fs.readFile(inputFile, {
      encoding: 'utf8'
    }, function (error, data) {
      if (data) {
        sendUpdate('Loaded data for file: ' + inputFile + ' Length (' + data.length + ')', 'info');
        var compiledData = compileFunction(data, inputFile);
        fs.writeFile(outputFile, compiledData, function(error) {
            if(error) {
                sendUpdate('Failed to write file: ' + outputFile, 'error');
                callback(error, false);
            }
            else {
              sendUpdate('Wrote file: ' + outputFile, 'warning');
              callback(false, true);
            }
        });
      } else {
        error = (error || 'File was empty');
        sendUpdate('Failed to compile: ' + inputFile + ' reason: ' + error, 'error');
        callback(error, false);
      }
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
