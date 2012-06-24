/**
  From http://svay.com/blog/hacking-rfid-with-nodejs/
*/

var HID = require( "HID" );

var devices = new HID.devices( 7592, 4865 );

var hid;

if ( !devices.length ) {
  console.log( "No mir:ror found" );

} else {
  
  hid = new HID.HID( devices[ 0 ].path );
  hid.write( [03, 01] ); //Disable sounds and lights
  hid.read( onRead );
}

function onRead( error, data ){
  var size;
  var id;
  var d = data[ 0 ];

  if ( d == 0 ) {
    hid.read( onRead );
    return;
  }

  if ( d == 2 ) {

    if ( data[ 1 ]  == 1 ){

      console.log( "-> RFID in" );

    } else if ( data[ 1 ] == 2 ) {

      console.log( "<- RFID out" );

    }

  }
    
 hid.read( onRead );
}
