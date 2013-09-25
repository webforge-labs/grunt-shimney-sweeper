/* global requirejs */
requirejs.config({
  baseUrl: '/rewrite/external-library/src',

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