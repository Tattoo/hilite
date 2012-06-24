var net = require( "net" );
var sys = require( "util" );


function prompt(){
  sys.print( "prompt> " );
}

function err( msg ){
  console.log( msg );
  process.exit( 1 );
}

if ( process.argv.length < 4 ) {
  err( "Give port number and url as parameters" );
}

var port = parseInt( process.argv[ 2 ] );

if ( port.toString() == "NaN" ) {
  err( "Give proper port number as parameter: " + port );
}

var url = process.argv[ 3 ];

if ( url == "" ){
  err( "Give proper url" );
}

function sendMessage( message ){
  var client = net.connect( port, url, function(){
    client.write( message );
    client.destroy();
  });
}

var stdin = process.openStdin();

prompt();

stdin.on( "data", function( chunk ){
  var msg = chunk.toString().replace( "\n", "" );
  sendMessage( msg );

  prompt();
} );

