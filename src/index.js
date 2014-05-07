/* eslint strict:0 */

var fs = require( "fs" )
  , path = require( "path" )
  , _ = require( "lodash" )
  , wrench = require( "wrench" )
  , svgicons2svgfont = require( "svgicons2svgfont" )
  , svg2ttf = require( "svg2ttf" )
  , ttf2eot = require( "ttf2eot" )
  , ttf2woff = require( "ttf2woff" )
  , async = require( "async" )
  , config = require( "./config" )
  , unicodeStart = 0xE001
  , templateText = null
  , logger = null;

var _makeDirectory = function ( dir ) {
  if ( !fs.existsSync( dir ) ) {
    logger.debug( "Making folder [[ " + dir + " ]]" );
    /* eslint no-octal:0 */
    wrench.mkdirSyncRecursive( dir, 0777 );
  }
};

var _getAllFolders = function ( mimosaConfig ) {
  var folders = wrench.readdirSyncRecursive( mimosaConfig.svgs2iconfonts.inDirFull ).map( function( shortPath ) {
    // build full path
    return path.join(mimosaConfig.svgs2iconfonts.inDirFull, shortPath);
  }).filter( function filterDir( fullpath ) {
    // only care about directories
    return fs.statSync(fullpath).isDirectory();
  }).filter( function filterRootDir( fullpath ) {
    // only care about root directories
    return (path.dirname(fullpath) === mimosaConfig.svgs2iconfonts.inDirFull);
  }).filter( function filterNoFiles( fullpath ) {
    // remove any folders that have no files in them
    var folderFiles = wrench.readdirSyncRecursive( fullpath ).map( function( shortPath ) {
      return path.join(fullpath, shortPath);
    });

    for (var i in folderFiles) {
      if (fs.statSync(folderFiles[i]).isFile()) {
        return true;
      }
    }

    logger.warn( "iconfont folder is empty [[ " + fullpath + " ]]" );

    return false;
  });

  return folders;
};

var _getFolderConfig = function ( mimosaConfig, folder ) {
  var files = fs.readdirSync( folder ).map( function( shortPath ) {
    // build full path
    return path.join(folder, shortPath);
  }).filter( function filterFiles( fullpath ) {
    // do not care about directories
    return fs.statSync(fullpath).isFile();
  }).filter( function filterRootDir( fullpath ) {
    // only care about .svg
    return ( path.extname(fullpath) === ".svg" );
  }).map( function generateFileConfig( fullpath, i ) {

    return {
      fullpath: fullpath,
      relativePath: fullpath.replace( mimosaConfig.root + path.sep, "" ),
      name:path.basename( fullpath, ".svg" ),
      hex:( unicodeStart + i ).toString( 16 ),
      codepoint: unicodeStart + i
    };
  });

  var folderName = path.basename( folder );
  var outFolderName = path.join( mimosaConfig.svgs2iconfonts.outDirFull, folderName );

  return {
    outFolder: outFolderName,
    folder: folder,
    folderName: path.basename( folder ),
    files: files,
    svgName: path.join( outFolderName, folderName + ".svg" ),
    ttfName: path.join( outFolderName, folderName + ".ttf" ),
    woffName: path.join( outFolderName, folderName + ".woff" ),
    eotName: path.join( outFolderName, folderName + ".eot" ),
    cssName: path.join( outFolderName, "stylesheet.css" )
  };
};

//write CSS file
var _writeCSS = function( folderConfigs ) {

  if ( !templateText ) {
    var templatePath = path.join( __dirname, "template", "stylesheet.css" );
    templateText = fs.readFileSync( templatePath, "utf8" );
  }

  folderConfigs.forEach( function writeCss( folderConfig ) {
    var cssText = _.template( templateText, folderConfig );
    fs.writeFileSync( folderConfig.cssName, cssText );
  });
};

var _createSVGFont = function( mimosaConfig, folderConfig, cb ) {
  var files = folderConfig.files.map( function( file ) {
    return {
      name: file.name,
      codepoint: file.codepoint,
      file: file.fullpath,
      stream: fs.createReadStream( file.fullpath )
    };
  });

  var options = _.clone( mimosaConfig.svgs2iconfonts.options );
  options.fontName = folderConfig.folderName;
  options.log = function(){};

  // Saving in a file
  var fontStream = svgicons2svgfont( files, options );
  fontStream.pipe( fs.createWriteStream( folderConfig.svgName ) )
    .on( "finish" ,function() {
      logger.success( "Font written: [[ " + folderConfig.svgName + " ]]" );
      cb();
    });
};

var _createTTFFont = function ( folderConfig ) {
  var svgText = fs.readFileSync( folderConfig.svgName, "utf8" );
  var ttf = svg2ttf( svgText, {} );
  fs.writeFileSync( folderConfig.ttfName, new Buffer( ttf.buffer ) );
  logger.success( "Font written: [[ " + folderConfig.ttfName + " ]]" );
};

var _createEOTFont = function ( folderConfig ) {
  var ttfBuffer = fs.readFileSync( folderConfig.ttfName );
  var ttfUint = new Uint8Array( ttfBuffer );
  var eotBuffer = new Buffer( ttf2eot( ttfUint ).buffer );
  fs.writeFileSync( folderConfig.eotName, eotBuffer );
  logger.success( "Font written: [[ " + folderConfig.eotName + " ]]" );
};

var _createWOFFFont = function ( folderConfig ) {
  var ttfBuffer = fs.readFileSync( folderConfig.ttfName );
  var ttfUint = new Uint8Array( ttfBuffer );
  var woffBuffer = new Buffer( ttf2woff( ttfUint ).buffer );
  fs.writeFileSync( folderConfig.woffName, woffBuffer );
  logger.success( "Font written: [[ " + folderConfig.woffName + " ]]" );
};

var _generateIconFonts = function ( mimosaConfig ) {

  if ( !fs.existsSync( mimosaConfig.svgs2iconfonts.inDirFull ) ) {
    logger.error( "Could not find svgs2iconfonts.inDir directory at [[ " + mimosaConfig.svgs2iconfonts.inDirFull + " ]]" );
    return;
  }

  // get folders to be processed
  var folders = _getAllFolders( mimosaConfig );

  // generate full config for each folder
  var folderConfigs = folders.map( function( folderConfig ) {
    return _getFolderConfig( mimosaConfig, folderConfig );
  });

  // create output directory for each folder
  folderConfigs.forEach( function makeFolderOutDirectory( folderConfig ) {
    _makeDirectory( folderConfig.outFolder );
  });

  // write CSS file for each folder
  _writeCSS( folderConfigs );

  // SVG creation is async, manage flow
  async.series([
    // create SVG fonts
    function( cb ) {
      async.eachSeries( folderConfigs, function( folderConfig, done ) {
        _createSVGFont( mimosaConfig, folderConfig, done );
      }, function( err ) {
        if ( err ) {
          logger.error( "An error occurred building SVG font" );
        }
        cb( err, null );
      });
    },

    // create rest of fonts
    function( cb ) {
      folderConfigs.forEach( function( folderConfig ) {
        _createTTFFont( folderConfig );
        _createEOTFont( folderConfig );
        _createWOFFFont( folderConfig );
      });
      cb();
    }
  ], function( err ) {
    if ( err ) {
      logger.error( "Unable to finish because of error: ", err );
    } else {
      logger.success( "Finished creating font files" );
    }
  });

  //console.log( JSON.stringify(folderConfigs, null, 2) );
};

var registerCommand = function ( program, retrieveConfig ) {
  program
    .command( "iconfonts" )
    .option("-D, --mdebug", "run in debug mode")
    .description( "Generate icon fonts from svgs" )
    .action( function( opts ){
      retrieveConfig( false, !!opts.mdebug, function( mimosaConfig ) {
        logger = mimosaConfig.log;
        _generateIconFonts( mimosaConfig );
      });
    });
};

module.exports = {
  registerCommand: registerCommand,
  defaults:        config.defaults,
  placeholder:     config.placeholder,
  validate:        config.validate
};