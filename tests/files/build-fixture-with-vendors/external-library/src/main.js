define(['some-plugin', 'submodule'], function (somePlugin, submodule) {
  
  return {
    name: 'external-library/main',
    submodule: submodule,
    somePlugin: somePlugin
  };

});