var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');
var exec = require('child_process').exec;
var chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;
chai.use(require('./helpers/file'));

var ConfigFile = require('requirejs-config-file').ConfigFile;

var tmpDir = "tmp/";
var tmpPath = function (relativePath) {
  return (tmpDir+relativePath).split(/\//).join(path.sep);
};

var utils = require('./helpers/grunt-utils');

before(function(done) {
  rimraf(tmpDir, done);
});

describe('update-config task', function() {

  it("should create the correct config file", function () {
    utils.task('shimney-sweeper:update-config').run(function (info) {
      utils.taskOK(info);

      var actual = grunt.file.read('tmp/config.js');
      var expected = grunt.file.read('tests/files/expected-config.js');

      assert.equals(actual, expected, 'config file should be created successfully.');
    });
  });
});
