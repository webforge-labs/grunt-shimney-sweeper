# shimney-sweeper [![Build Status](https://www.travis-ci.org/webforge-labs/grunt-shimney-sweeper.png?branch=master)](https://www.travis-ci.org/webforge-labs/grunt-shimney-sweeper)


Housekeep your shimney with grunt.

## install with npm
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-shimney-sweeper --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-shimney-sweeper');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html


## usage

```
grunt shimney-sweeper:update-config
```

reads all your installed shimney packages from npm and writes your config to `www/js/config.js`.

use
```javascript
grunt.initConfig({
  "shimney-sweeper": {
    options: {
      configFile: "other/placed/config.js"
      nodeModulesUrl: "../../" // with trailing slash, without node_modules/ appended
    }
  }
});
```
in your `Gruntfile.js` to configure the sweeper.