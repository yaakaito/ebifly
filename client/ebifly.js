var ebifly = {

    event : {
        
    },

    socket : null,

    message : {

        last : 0
    },

    last : 0
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
                                 });1

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

};

/* 
   fly log
*/
ebifly.log = function( val){
    var log = ebifly.message.createLog( val);
    this.socket.send( log);
};
ebifly.exception = function( val){
    var log = ebifly.message.createException( val);
    this.socket.send( log);
};
ebifly.result = function( val){
    var log = ebifly.message.createResult( val);
    this.socket.send( log);
};

/* 
   cosole events
*/
ebifly.event.message = function( data){

    // Add mother time
    data.ct = ebifly.message.createTimeString( new Date())

    // rewrite message last id
    ebifly.message.last = +data.last;

    
    if( data.type == "SCR"){
        // insert log
        ebifly.executeScript( data);
    }
};


/*
  executeScript
*/
ebifly.executeScript = function( data){

    try {
        ebifly.result( eval( data.msg));
    }catch( e){
        ebifly.exception( e.message);
    } 
}
/*
  ebifly message format
*/

ebifly.message.createLog = function( val){
    var base = this.createBase();
    base.type = "LOG";
    base.msg = val;
    return base;
};

ebifly.message.createException = function( val){
    var base = this.createBase();
    base.type = "EXP";
    base.msg = val;
    return base;
};

ebifly.message.createResult = function( val){
    var base = this.createBase();
    base.type = "RES";
    base.msg = val;
    return base;
};


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

(function(){
    
    // start debug
    ebifly.connect( { host : "localhost",
                      port : 8080});

    
})();