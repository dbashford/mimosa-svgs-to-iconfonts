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
