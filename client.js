/**
  From http://svay.com/blog/hacking-rfid-with-nodejs/
*/

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
  var client = net.connect(8080, "127.0.0.1", function(){
    client.write( message );
    client.destroy();
  });
}


