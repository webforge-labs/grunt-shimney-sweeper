var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('./helpers/file'));

describe('sweepout', function() {
  var tmp = "tmp";
  var sweeper = require('../lib/shimney/sweeper')(grunt);

  describe('exports all necessary files to another directory', function() {

    var packages = [
      {
        name: "knockout",
        location: "shimney/knockout"
      },
      {
        name: "jquery",
        location: "shimney/jquery"
      },
      {
        name: "sammy",
        location: "shimney/sammy"
      },
      {
        name: "twitter-bootstrap",
        location: "shimney/twitter-bootstrap"
      },
      {
        name: "lodash",
        location: "shimney/lodash"
      },
      {
        name: "hogan",
        location: "shimney/hogan"
      },
      {
        name: "cookie-monster",
        location: "shimney/cookie-monster"
      },
      {
        name: "JSON",
        location: "shimney/JSON"

      }
    ];

    beforeEach(function(done) {
      rimraf(tmp, done);
    });

    it('should export all packages avaible to shimney', function(done) {
      sweeper.sweepout({packageDir: 'test/files/package_fixture', dir: 'tmp'}, function(err, config) {

        _(packages).pluck('name').forEach(function(name) {
          var packageDir = [tmp, 'shimney', name].join(path.sep);

          expect(packageDir).to.be.an.existingDirectory;
          expect(packageDir+path.sep+'main.js').to.be.an.existingFile;
        });


        done();
      });
    });

    it("should export the assets listet in the shimney config as well", function(done) {
      sweeper.sweepout({packageDir: 'test/files/package_fixture', dir: 'tmp'}, function(err, config) {

        var bs = [tmp, 'shimney', 'twitter-bootstrap'].join(path.sep);

        // check some specials
        expect([bs, 'css']).to.be.an.existingDirectory;
        expect([bs, 'img']).to.be.an.existingDirectory;

        expect([bs, 'img', 'glyphicons-halflings.png']).to.be.an.existingFile;
        expect([bs, 'img', 'glyphicons-halflings-white.png']).to.be.an.existingFile;

        expect([bs, 'css', "bootstrap.css"]).to.be.an.existingFile;
        expect([bs, 'css', "bootstrap-responsive.css"]).to.be.an.existingFile;

        done();
      });
    });

    it("should provide a changed config for the exported packages and write it", function(done) {
      sweeper.sweepout({packageDir: 'test/files/package_fixture', dir: 'tmp'}, function(err, config) {
        expect(err).to.not.exist;

        assert.deepEqual(config, {packages: packages});
        expect([tmp, 'config.js']).to.be.an.existingFile;
        done();
      });
    });
  });
});
