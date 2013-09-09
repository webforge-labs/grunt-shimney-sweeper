define(['some-plugin', 'submodule'], function (somePlugin, submodule) {

  return {
    name: 'project (this is the main file)',
    fromExternalLibrary: {
      somePlugin: somePlugin,
      submodule: submodule,
    }
  };

});