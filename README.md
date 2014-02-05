# shimney-sweeper [![Build Status](https://travis-ci.org/webforge-labs/grunt-shimney-sweeper.png?branch=master)](https://travis-ci.org/webforge-labs/grunt-shimney-sweeper)


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
grunt sweepout
```

reads all your installed shimney packages exports them and writes a config for them.

```
grunt sweep-config
```
reads all your installed shimney packages from npm and writes your config to `www/js/config.js`.

```
grunt merge-configs
```

merges serval requirejs configuration together, into a new config file. The config file might be a module as a template and the merge of all configs can be adjusted

use
```javascript
grunt.initConfig({
  "sweep-config": {
    www: {
      options: {
        configFile: "www/js/config.js",
        nodeModulesUrl: "../../" // with trailing slash, without node_modules/ appended
      }
    }
  },

  "sweepout": {
    test: {
      options: {
        //configFile: "build/js/config.js", // where to write the config to. Uses ${dir}/config.js as default
        // packageRoot: "tmp" // change this if your node_modules directory is not sibling to the gruntfile root
        //dir: "build/js" or specifiy the output-dir on commandline with --dir
      }
    }
  },

  "merge-configs": {
    rjsboot: {
      options: {
        targetFile: 'build/js/boot.js',

        configFiles: [
          'www/js/mylibrary/config.js',
          'www/js/config.js'
        ]

        modify: function(mergedConfig) { // can return or modify the mergedConfig that is written
          return { paths: {'user': 'overriden'} };
        }

        template: 'resources/config-template.js', // use this to inject the config in this file (will not be modified)
      }
    }
  }
});
```
in your `Gruntfile.js` to configure the sweeper.

your `config-template.js` used in merge-configs could be like this:

```
var require = {

}

if (typeof(requirejs) === "function") {
  requirejs.config(require);
}
```
This allows you to use the merged config before loading requirejs (recommended if you change the baseUrl) or as a data-main attribute in requirejs.

## Migration

### 1.0.0 => 1.1.0
  - change `config` option into `configFile`

### 1.0.0 => 1.2.0
  - commands are now: sweepout, sweep-config, merge-configs
  - all commands are multi tasks
