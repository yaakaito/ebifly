var ebifly = {

    event : {
        
    },

    socket : null,

    message : {

        last : 0
    },

    last : 0,
    lastHTMLHash : null,
    lastEbiId : 0
};

ebifly.connect = function( options){

    /* 
       Socket.io
     */
    // Create Socket.io socket
    // Default host=>localhost port=>8080
    this.socket = new io.Socket( (options.host || "localhost") ,
                                 {
                                     port : (options.port || 8080),
                                     rememberTransport : false
                                 });

    // Connect Socket.io
    this.socket.connect();
    
    // Map Socket.io Events
    this.socket.on( "connect", function( evt){
     //   ebifly.event.connect( evt);
    });
    this.socket.on( "message", function( msg){
        ebifly.event.message( msg);
    });
    this.socket.on( "disconnect", function( evt){
     //   ebifly.event.disconnect( evt);
    });

    // HTML send
   // setInterval( function(){
   //     ebifly.sendHTML();
   // }, 100);

};

/* 
   cosole events
*/
ebifly.event.message = function( data){

    // rewrite message last id
    ebifly.message.last = +data.last;

    
    if( data.type == EBI.message.type.script){
        // insert log
        ebifly.executeScript( data);
    }else if( data.type == "RHT"){
        ebifly.sendHTML( true);
    }
};


/*
  ebifly message format
*/


ebifly.message.createBase = function(){
    return {
        id: this.last++,
        type: null,
        org: "c", //Client
        msg: "base message",
        mt: null,
        st: null,
        ct: this.createTimeString( new Date())
    };

};


ebifly.message.createTimeString = function( date){

	  var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	  if( hour < 10){ hour = "0" + hour; }
	  if( min < 10){ min = "0" + min; }
	  if( sec < 10){ sec = "0" + sec; }
    if( msec < 10){ msec = "0" + msec; }
    if( msec < 100){ msec = "0" + msec; }
    
    return hour + ":" + min + ":" + sec + "." + msec;
};

/*
(function(){
    
    // start debug
    ebifly.connect( { host : "localhost",
                      port : 8080});

    
})();
*/