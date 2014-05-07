mimosa-svgs-to-iconfonts
===========
## Overview

## Usage

Add `'svgs-to-iconfonts'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

Once this module has been added to your project, just execute `mimosa iconfonts` to generate your fonts.  This module comes with some default config (see below) and if your project matches that config, you won't have any other work to do.

## Functionality

This module will process the `.svg` contents of specific folders and create `.svg`, `.woff`, `.ttf` and `.eot` font files.  It will also generate a matching `.css` file.

The CSS font classes are named for the name of the original `.svg` file.

So, if you have a folder `fonts/svgs/login` (see default config below), and inside that folder you have a `submit.svg` and a `cancel.svg`, this module will those two `.svg`s and create 4 files, `font-login.svg|woff|ttf|eot`, and will create a `font-login.css`.  Inside the `.css` will be icon styles named for the original `.svg`, `.icon-submit` and `.icon-login`.

## Default Config

```javascript
svgs2iconfonts: {
  inDir: "fonts/svgs",
  outDir: "fonts",
  options: {
    fixedWidth: false,
    normalize: false,
    fontHeight: 512,
    descent: -32
  }
}
```

* `inDir`: a string. The folder inside which are the folders of `.svg`s to font-ify.  So, inside `fonts/svgs`, if there are two folders, `abc` and `xyz`, those folders contents would be considered a single font file output. This path is relative to `watch.sourceDir` which defaults to `assets`
* `outDir`: Where to place generated font assets relative to `watch.sourceDir` which defaults to `assets`. For each folder inside `inDir` a folder is created inside the `outDir`.  So if there are two folders inside `fonts/svgs`, `abc` and `xyz`, after processing the `outDir` would also have two folders named `abc` and `xyz` and the font-ified assets will be inside including the `.css` file.
* `options.fixedWidth`: a boolean, creates a monospace font of the width of the largest input icon.
* `options.normalize`: a boolean, normalize icons by scaling them to the height of the highest icon.
* `options.fontHeight`: a number,
* `options.descent`: a number, the font descent. It is useful to fix the font baseline yourself.
