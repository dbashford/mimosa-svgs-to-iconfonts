"use strict";

var path = require( "path" );

exports.defaults = function() {
  return {
    svgs2iconfonts: {
      inDir: "fonts/svgs",
      outDir: "fonts",
      options: {
        fixedWidth: false,
        normalize: true,
        fontHeight: 512,
        descent: -32
      }
    }
  };
};

exports.placeholder = function () {
   var ph = "  svgs2iconfonts:                     #\n" +
      "    inDir: \"fonts/svgs\" # The folder inside which are the folders of '.svg's to font-ify.\n" +
      "                          # So, inside 'fonts/svgs', if there are two folders, 'abc' and 'xyz',\n" +
      "                          # those folders contents would be considered a single font file output.\n" +
      "                          # This path is relative to 'watch.sourceDir' which defaults to 'assets'\n" +
      "    outDir: \"fonts\"     # Where to place generated font assets relative to 'watch.sourceDir'\n" +
      "                          # which defaults to 'assets'. For each folder inside 'inDir' a folder\n" +
      "                          # is created inside the 'outDir'.  So if there are two folders inside\n" +
      "                          # 'fonts/svgs', 'abc' and 'xyz', after processing the 'outDir' would\n" +
      "                          # also have two folders named 'abc' and 'xyz' and the font-ified assets\n" +
      "                          # will be inside including the '.css' file.\n" +
      "    options:              # options passed to https://github.com/nfroidure/svgicons2svgfont\n" +
      "      fixedWidth: false   # creates a monospace font of the width of the largest input icon.\n" +
      "      normalize: false    # normalize icons by scaling them to the height of the highest icon\n" +
      "      fontHeight: 512     # the outputted font height\n" +
      "      descent: -32        # the font descent. It is useful to fix the font baseline yourself.\n";

  return ph;
};

exports.validate = function ( config, validators ) {
  var errors = [];
  if ( validators.ifExistsIsObject( errors, "svgs2iconfonts config", config.svgs2iconfonts ) ) {
    if ( validators.ifExistsIsString( errors, "svgs2iconfonts.inDir", config.svgs2iconfonts.inDir ) ) {
      config.svgs2iconfonts.inDirFull = path.join( config.watch.sourceDir, config.svgs2iconfonts.inDir );
    }

    if ( validators.ifExistsIsString( errors, "svgs2iconfonts.outDir", config.svgs2iconfonts.outDir ) ) {
      config.svgs2iconfonts.outDirFull = path.join( config.watch.sourceDir, config.svgs2iconfonts.outDir );
    }

    if ( validators.ifExistsIsObject( errors, "svgs2iconfonts.options", config.svgs2iconfonts.options ) ) {
      validators.ifExistsIsBoolean( errors, "svgs2iconfonts.options.fixedWidth", config.svgs2iconfonts.options.fixedWidth );
      validators.ifExistsIsBoolean( errors, "svgs2iconfonts.options.normalize", config.svgs2iconfonts.options.normalize );
      validators.ifExistsIsNumber( errors, "svgs2iconfonts.options.fontHeight", config.svgs2iconfonts.options.fontHeight );
      validators.ifExistsIsNumber( errors, "svgs2iconfonts.options.descent", config.svgs2iconfonts.options.descent );
    }

  }

  return errors;
};