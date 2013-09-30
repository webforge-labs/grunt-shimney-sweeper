var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');
var exec = require('child_process').exec;
var chai = require('chai'),
  expect = chai.expect,
  assert = chai.assert;
chai.use(require('./helpers/file'));

var tmpDir = 'tmp/', tmpPath = function (relativePath) {
  return (tmpDir+relativePath).split(/\//).join(path.sep);
};

var GruntUtil = require('./helpers/grunt-utils');
var utils = new GruntUtil('sweep-config');

describe('task sweep-config', function() {

  beforeEach(function(done) {
    rimraf(tmpDir, done);
  });

  it("should create the correct config file", function (done) {
    utils.task('test').run(function (info) {
      utils.taskOK(info);

      var actual = grunt.file.read(tmpPath('config.js'));
      var expected = grunt.file.read('test/files/expected-config.js');

      assert.equal(actual, expected, 'config file should be created successfully.');
      done();
    });
  });
});
