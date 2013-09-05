var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');

var chai = require('chai');
var expect = chai.expect;
chai.use(require('./helpers/file'));

describe('sweepout', function() {
  var tmp = "tmp";
  var sweeper = require('../lib/shimney/sweeper')(grunt);

  describe('exports all necessary files to another directory', function() {

    var packages = [
      {
        name: "knockout",
        location: "node_modules/shimney-knockout"
      },
      {
        name: "jquery",
        location: "node_modules/shimney-jquery"
      },
      {
        name: "sammy",
        location: "node_modules/shimney-sammy"
      },
      {
        name: "twitter-bootstrap",
        location: "node_modules/shimney-twitter-bootstrap"
      },
      {
        name: "lodash",
        location: "node_modules/shimney-lodash"
      },
      {
        name: "hogan",
        location: "node_modules/shimney-hogan"
      },
      {
        name: "cookie-monster",
        location: "node_modules/shimney-cookie-monster"
      },
      {
        name: "JSON",
        location: "node_modules/shimney-cookie-monster/node_modules/shimney-json"

      }
    ];

    beforeEach(function(done) {
      rimraf(tmp, done);
    });

    it('should export all packages avaible to npm', function(done) {
      sweeper.sweepout({packageDir: 'tests/files/package_fixture', dir: 'tmp'}, function(err, config) {

        _(packages).pluck('name').forEach(function(name) {
          expect([tmp, 'npm', name]).to.be.an.existingDirectory;
        });

        done();

      });

    });
  });
});
