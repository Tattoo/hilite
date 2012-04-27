!!!
%html
  %head
    %title Hilite
    %link{ rel: "stylesheet", href: css }
    %script{ src: "/socket.io/socket.io.js", }
    :javascript
      function init(){
        var socket = io.connect( "#{socket}" );
        socket.on( "update", function( data ){
          // You have to make the content part of DOM before inserting it in the container
          var content = document.getElementById( "content" );
          while( content.firstChild ){
            content.removeChild( content.firstChild );
          }
          var el = document.createElement("div");
          el.innerHTML = data[ "content" ];
          content.appendChild( el );
        });
      }

      

  %body{ onload: "init()" }
    %center
      %h1 
        Hello
        %br
        %div{ id: "content" }
          = content
