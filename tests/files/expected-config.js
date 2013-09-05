/* globals requirejs */
requirejs.config({
  packages: [
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
  ]
});
