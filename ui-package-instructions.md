How to build a shimney-ui package?
=====================

Here are a few steps:
----------
#### <i class="icon-folder-open"></i> create a new git-repository

> - Your package should be called "shimney-ui-\packageName\"

#### <i class="icon-file"></i> create package.json

> - package.json must be created in the directory root
> sonn you will have a plugin so that you can do it quickly

#### <i class="icon-file"></i> so must look your package structure:

> <i class="icon-folder-open"></i> root
> - package.json
> - main.js
> - <i class="icon-folder-open"></i> img

The 'main.js' is the main js-File of your module,
In the folder 'img' should lay all images. 
Other files (css, less, tests, js) can lay anywhere in the package.