/* 
 *  ebifly
 *  iPhone/iPad Remote Debugger
 *  Logs/HTML/CSS/DOM
 */var ebifly = {

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
    setInterval( function(){
        ebifly.sendHTML();
    }, 100);

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

ebifly.sendHTML = function(){
    var html = this.message.createHTML( 
            this.message.elementToJSON( document.querySelector("html"))
        );
    if( arguments.length == 1 && arguments[0] == true){
        html.broadcast = true;
    }

    this.socket.send( html);

}
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
    }else if( data.type == "RHT"){
        ebifly.sendHTML( true);
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

ebifly.message.createHTML = function( val){

    var base = this.createBase();
    base.type = "HTM";
    base.msg = val;
    return base;
}

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

ebifly.message.elementToJSON = function( elem){
    
    if( elem.tagName == null || elem.tagName === undefined){
        console.log( elem.innerHTML);
        return {
            tag : "TextNode",
            value : elem.nodeValue,
            str : "TextNode" + elem.innerHTML
        };

    }
    var obj = {
        tag : elem.tagName.toLowerCase(),
        attributes : [],
        children : [],
        str : elem.tagName.toLowerCase()
    }, i=0, j=0, len,
    attr = function( name, value){
        return { name: name, value: value};
    };
    obj.str += elem.attributes.length;
    for( len = elem.attributes.length; i < len; i++){
        obj.attributes.push( attr( elem.attributes[i].name, elem.attributes[i].value));
        obj.str = obj.str + elem.attributes[i].name + elem.attributes[i].value;
    }

    for( len = elem.childNodes.length; j < len; j++){
        obj.children.push( this.elementToJSON( elem.childNodes[j]));
    }
    obj.str += len;

    return obj;
};

(function(){
    
    // start debug
    ebifly.connect( { host : "localhost",
                      port : 8080});

    
})();    /* powered by yaakaito */