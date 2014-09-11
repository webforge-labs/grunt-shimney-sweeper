/* global requirejs */
requirejs.config({
  baseUrl: '/rewrite/external-library/src',

  packages: [
    // this package should be appended in merge
    {
      name: "datepicker",
      location: "../node_modules/shimney-datepicker"
    },
    // this package should overwrite
    {
      name: "knockout",
      location: "../other-path/../node_modules/shimney-knockout"
    }
  ],
  
  paths: {
    app: '/js',
    flash: '../assets/flash'
  },
  
  urlArgs: "bust=" +  (new Date()).getTime()
});

define(['require', 'boot-helper'], function(require, boot) {

  require(['app/main']);

  return boot;
});