module.exports = function (chai, utils) {
  var grunt = require('grunt');
  var _ = grunt.util._;
  var Assertion = chai.Assertion;
  var path = require('path');

  var toPath = function(obj) {
    if (_.isArray(obj)) {
      return obj.join(path.sep);
    } else {
      return obj;
    }
  };

  chai.Assertion.addProperty('existingFile', function () {
    var act = toPath(this._obj);

    this.assert(
      grunt.file.isFile(act),
      "expected #{act} to be an existing file",
      "expected #{act} to not be an existing file",
      undefined,
      act
    );
  });

  chai.Assertion.addProperty('existingDirectory', function () {
    var act = toPath(this._obj);

    this.assert(
      grunt.file.isDir(act),
      "expected #{act} to be an existing directory",
      "expected #{act} to not be an existing directory",
      undefined,
      act
    );
  });

};
