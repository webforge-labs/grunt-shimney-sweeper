var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('./helpers/file'));

describe('task sweepout', function() {
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
      },
      {
        name: "ui-datepicker",
        location: "shimney/ui-datepicker"
      },
      {
        name: "ui-autocomplete",
        location: "shimney/ui-autocomplete"
      }
    ];

    beforeEach(function(done) {
      rimraf(tmp, done);
    });

    it('should export all packages available to shimney', function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', dir: tmp, js: "js", less: "less", css: "css", img: "img"}, function(err, config) {

        _(packages).pluck('name').forEach(function(name) {
          var packageDir = [tmp, 'shimney', name].join(path.sep);

          expect(packageDir).to.be.an.existingDirectory;
          expect(packageDir+path.sep+'main.js').to.be.an.existingFile;
        });

        done();
      });
    });

    it("should export the assets listed in the shimney config as well", function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', dir: tmp, js: "js", less: "less", css: "css", img: "img"}, function(err, config) {

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

    it("should export the css, less und images from ui-packages", function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', dir: tmp, js: "js", less: "less", css: "css", img: "img"}, function(err, config) {

        var dp = [tmp, 'shimney', 'ui-datepicker'].join(path.sep);

        // check some specials
        expect([dp, 'css']).to.be.an.existingDirectory;
        expect([dp, 'img']).to.be.an.existingDirectory;
        expect([dp, 'less']).to.be.an.existingDirectory;

        expect([dp, 'img', 'dp.png']).to.be.an.existingFile;
        expect([dp, 'css', "dp.css"]).to.be.an.existingFile;
        expect([dp, 'less', "dp.less"]).to.be.an.existingFile;


        var ac = [tmp, 'shimney', 'ui-autocomplete'].join(path.sep);

        // check some specials
        expect([ac, 'css']).to.be.an.existingDirectory;
        expect([ac, 'img']).to.be.an.existingDirectory;
        expect([ac, 'less']).to.be.an.existingDirectory;

        expect([ac, 'img', 'auco.png']).to.be.an.existingFile;
        expect([ac, 'img', 'ac.jpg']).to.be.an.existingFile;
        expect([ac, 'less', 'au.less']).to.be.an.existingFile;
        expect([ac, 'css', 'au.css']).to.be.an.existingFile;
        done();
      });
    });

    it("should provide a changed config for the exported packages and write it", function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', dir: tmp, js: "js", less: "less", css: "css", img: "img"}, function(err, config) {
        expect(err).to.not.exist;
        assert.deepEqual(config, {packages: packages});
        expect([tmp, 'config.js']).to.be.an.existingFile;
        done();
      });
    });
 
    it("should provide a changed config written to options.configFile", function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', dir: tmp, js: "js", less: "less", css: "css", img: "img", configFile: tmp+'/other-config.js'}, function(err, config) {
        expect(err).to.not.exist;

        assert.deepEqual(config, {packages: packages});
        expect([tmp, 'other-config.js']).to.be.an.existingFile;
        done();
      });
    });

    it('should export all packages available to shimney with a baseUrl', function(done) {
      sweeper.sweepout({packageRoot: 'test/files/package_fixture', baseUrl: "relative/path/", dir: tmp, js: "js", less: "less", css: "css", img: "img"}, function(err, config) {

        var packages = [
          {
            name: "knockout",
            location: "relative/path/shimney/knockout"
          },
          {
            name: "jquery",
            location: "relative/path/shimney/jquery"
          },
          {
            name: "sammy",
            location: "relative/path/shimney/sammy"
          },
          {
            name: "twitter-bootstrap",
            location: "relative/path/shimney/twitter-bootstrap"
          },
          {
            name: "lodash",
            location: "relative/path/shimney/lodash"
          },
          {
            name: "hogan",
            location: "relative/path/shimney/hogan"
          },
          {
            name: "cookie-monster",
            location: "relative/path/shimney/cookie-monster"
          },
          {
            name: "JSON",
            location: "relative/path/shimney/JSON"
          },
          {
            name: "ui-datepicker",
            location: "relative/path/shimney/ui-datepicker"
          },
          {
            name: "ui-autocomplete",
            location: "relative/path/shimney/ui-autocomplete"
          }
        ];

        assert.deepEqual(config, {packages: packages});

        done();
      });
    });

  });
});
