var ConfigFile = require('requirejs-config-file').ConfigFile;
var grunt = require('grunt');
var TaskRunner = require('./task-runner');
var chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;

chai.use(require('./file'));

module.exports = function (taskName) {

  this.taskName = taskName;

  this.GRUNT_EXIT = {
    OK: 0,
    TASK_ERROR: 3,
    FATAL_ERROR: 1
  },

  this.readConfig = function(configPath, cb) {
    var configFile = new ConfigFile(configPath);

    configFile.read(function(err, config, data) {
      if (err) {
        cb('should be able to read config in boot from: '+configPath+" contents of the file are: >>>"+grunt.file.read(configPath)+"<<<\nerror is: "+err);
      } else {
        cb(null, config, data);
      }
    });
  };

  this.runAndRead = function(taskTarget, configPath, cb) {
    var utils = this;

    utils.task(taskTarget).run(function(info) {
      utils.taskOK(info);
      expect(configPath).to.be.an.existingFile;

      utils.readConfig(configPath, cb);
    });
  };

  this.task = function(taskTarget, cliOptions) {
    var runner = new TaskRunner(this.taskName, taskTarget || 'test', cliOptions);

    return runner;
  };

  this.taskOK = function(info) {
    expect(info.out).to.contain('Done, without errors');
    expect(info.code).to.be.equal(this.GRUNT_EXIT.OK);
  };
};