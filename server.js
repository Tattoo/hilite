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
  , "tcpPort" : 8080
}


function merge(o1, o2){
  o3 = {};
  for (var attr in o1) { o3[attr] = o1[attr]; }
  for (var attr in o2) { o3[attr] = o2[attr]; }
  return o3;
}

function onHttpRequest( req, res ){
  
  var content = haml( fs.readFileSync( ( config[ "status" ] ? "ok.tpl" : "nok.tpl" ), "utf8" ) );
  var pageData = {
      "css": config[ "cssUrl" ]
    , "content": content( config )
  }
  var layout = haml( fs.readFileSync( "index.tpl", "utf8" ) );
  

  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end( layout( pageData ) );
}

function onTcpRequest( socket ){

  socket.on( "data", function( data ){
    var data = data.toString();
    if ( data == "in" ){
      config[ "status" ] = true;
    } else if ( data == "out" ){
      config[ "status" ] = false;
      config[ "lastTime" ] = new Date();
    }
  });

}

http.createServer( onHttpRequest ).listen( config[ "httpPort" ] );

net.createServer( onTcpRequest ).listen( config[ "tcpPort" ] );
console.log( "server started" )
