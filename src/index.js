"use strict";

var config = require( "./config" );

var registerCommand = function ( program, logger, retrieveConfig ) {
  program
    .command( "iconfonts" )
    .option("-D, --mdebug", "run in debug mode")
    .description( "Generate icon fonts from svgs" )
    .action( function( opts ){
      var retrieveConfigOpts = {
        buildFirst: false,
        mdebug: !!opts.mdebug
      };
      retrieveConfig( retrieveConfigOpts, function( mimosaConfig ) {
        var generateIconFonts = require( "./command" );
        generateIconFonts( mimosaConfig );
      });
    });
};

module.exports = {
  registerCommand: registerCommand,
  defaults:        config.defaults,
  validate:        config.validate
};
