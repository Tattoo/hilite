var http = require( "http" );
var net = require( "net" );
var fs = require( "fs" );
var haml = require( "./haml-js/lib/haml" );
var io = require( "socket.io" );

var config = {
    "staticUrl" : "http://cs.helsinki.fi/u/tkairi/kuvat/"
  , "lastTime" : new Date()
  , "cssUrl" : "http://twitter.github.com/bootstrap/assets/css/bootstrap.css"
  , "httpPort" : 8088
  , "tcpPort" : 8089
  , "cache" : {}
  , "socketIoConnect" : "http://localhost"
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

function clearCache( /* Array */ clearedItems ){ 
  clearedItems.forEach(function( item ){
    delete config[ "cache" ][ item ];
  });
}

function onHttpRequest( req, res ){
 
  var pageData = {
      "css": config[ "cssUrl" ]
    , "socket": config[ "socketIoConnect" ]
    , "lastTime": config[ "lastTime" ]
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
      clientSocket.sockets.emit( "update", { "content": getCachedContent( "ok.tpl", config ) } );
    } else if ( data == "out" ){
      config[ "lastTime" ] = new Date();
      clearCache( [ "nok.tpl" ] );
      clientSocket.sockets.emit( "update", { "content": getCachedContent( "nok.tpl", config ) } );
    }
  });

}

var server = http.createServer( onHttpRequest );
server.listen( config[ "httpPort" ] );
var clientSocket = io.listen( server );

clientSocket.on( "connect", function(){
  clientSocket.sockets.emit( "update", { content: getCachedContent( "nok.tpl", config ) } );
});

net.createServer( onTcpRequest ).listen( config[ "tcpPort" ] );
console.log( "Ready to go!" )
