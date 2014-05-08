"use strict";

var config = require( "./config" );

var registerCommand = function ( program, retrieveConfig ) {
  program
    .command( "iconfonts" )
    .option("-D, --mdebug", "run in debug mode")
    .description( "Generate icon fonts from svgs" )
    .action( function( opts ){
      retrieveConfig( false, !!opts.mdebug, function( mimosaConfig ) {
        var generateIconFonts = require( "./command" );
        generateIconFonts( mimosaConfig );
      });
    });
};

module.exports = {
  registerCommand: registerCommand,
  defaults:        config.defaults,
  placeholder:     config.placeholder,
  validate:        config.validate
};