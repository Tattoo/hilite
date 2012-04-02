/**
  From http://svay.com/blog/hacking-rfid-with-nodejs/
*/

function err( msg ){
  console.log( msg );
  process.exit( 1 );
}

if ( process.argv.length < 4 ) {
  err( "Give port number and url as parameters" );
}

var port = parseInt( process.argv[2] );

if ( port.toString() == "NaN" ) {
  err( "Give proper port number as parameter: " + port );
}

var url = process.argv[3];

if ( url == "" ){
  err( "Give proper url" );
}

var HID = require( "HID" );
var devices = new HID.devices( 7592, 4865 );
var hid;
var net = require( "net" );

if ( !devices.length ) {
  console.log( "No mir:ror found" );
} else {
  hid = new HID.HID( devices[ 0 ].path );
  hid.write( [03, 01] ); //Disable sounds and lights
  hid.read( onRead );
}

function getMessage( data ){
  if ( data[ 0 ] == 2 && data[ 1 ] == 1 ) {
    return "in";
  }

  return "out";
}

function onRead( error, data ){

  if ( data[ 0 ] == 0 ) {
    hid.read( onRead );
    return;
  }

  sendMessage( getMessage( data ) );
  hid.read( onRead );
}

function sendMessage( message ){
  var client = net.connect( port, url, function(){
    client.write( message );
    var now = new Date().toTimeString().split(" ")[0];
    console.log( "[%s] Sent <%s> to %s:%s", now, message, url, port );
    client.destroy();
  });
}


