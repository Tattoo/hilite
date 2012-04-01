var http = require( "http" );
var net = require( "net" );
var fs = require( "fs" );
var haml = require( "./haml-js/lib/haml" );

var config = {
    "status" : false
  , "staticUrl" : "http://cs.helsinki.fi/u/tkairi/kuvat/"
  , "lastTime" : new Date()
  , "cssUrl" : "http://twitter.github.com/bootstrap/assets/css/bootstrap.css"
  , "httpPort" : 8088
  , "tcpPort" : 8089
  , "cache" : {}
}


function getCachedContent( name, context ){
  var cache = config[ "cache" ]; 
 
  if ( cache.hasOwnProperty( name ) ){
    return cache[ name ];
  }

  func = haml( fs.readFileSync( name, "utf-8" ) );
  cache[ name ] = func( context );
  return cache[ name ];
}

function clearCache( clearedItems ){ // function assumes clearedItems is Array
  clearedItems.forEach(function( item ){
    delete config[ "cache" ][ item ];
  });
}

function onHttpRequest( req, res ){
 
  var partial = ( config[ "status" ] ? "ok.tpl" : "nok.tpl" ); 
  var pageData = {
      "css": config[ "cssUrl" ]
    , "content": getCachedContent( partial, config )
  }

  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end( getCachedContent( "index.tpl", pageData ) );
}

function onTcpRequest( socket ){

  socket.on( "data", function( data ){
    var data = data.toString();
    var now = new Date().toTimeString().split(" ")[0];
    console.log( "[%s] Got data: <%s>", now, data );

    if ( data == "in" ){
      config[ "status" ] = true;
      clearCache( ["index.tpl"] );
    } else if ( data == "out" ){
      config[ "status" ] = false;
      config[ "lastTime" ] = new Date();
      clearCache( [ "nok.tpl", "index.tpl" ] );
    }
  });

}

http.createServer( onHttpRequest ).listen( config[ "httpPort" ] );

net.createServer( onTcpRequest ).listen( config[ "tcpPort" ] );
console.log( "server started" )
