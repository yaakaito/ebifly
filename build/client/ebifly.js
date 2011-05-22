/* 
 *  ebifly
 *  iPhone/iPad Remote Debugger
 *  Logs/HTML/CSS/DOM
 */var ebi = {
    message : {
        type : {
            none : 99,
            log : 0,
            exception: 1,
            script : 2,
            result : 3,
            requestHTML : 4,
            sendHTML : 5
        },
        
        origin : {
            unkown: 99,
            client : 0,
            server : 1,
            console : 2
        },
        
        last : 0
    },
    createMessageObject : function(){
        return {
            id : this.message.last++,
            type : this.message.type.none,
            msg : "",
            origin : this.message.type.unkown,
            time : this.createTimeString( new Date())
        };
    },
    createTimeString : function( date){
        var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	      if( hour < 10){ hour = "0" + hour; }
	      if( min < 10){ min = "0" + min; }
	      if( sec < 10){ sec = "0" + sec; }
        if( msec < 10){ msec = "0" + msec; }
        if( msec < 100){ msec = "0" + msec; }
        return hour + ":" + min + ":" + sec + "." + msec;
    }
};
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

    
    if( data.type == ebi.message.type.script){
        // insert log
        ebifly.executeScript( data);
    }else if( data.type == "RHT"){
        ebifly.sendHTML( true);
    }
};


/*
  ebifly message format
*/

ebifly.message.createHTML = function( val){

    var base = this.createBase();
    base.type = "HTM";
    base.msg = val;
    return base;
}

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
/*
(function(){
    
    // start debug
    ebifly.connect( { host : "localhost",
                      port : 8080});

    
})();
*/(function(){
    attachEbiIds = function( element, id){
        if( element.tagName === null || element.tagName === undefined){
            return id;
        }
        
        element.setAttribute("ebifly", id++);
        var i = 0, len = element.childNodes.length;
        for( ; i < len; i++){
            id = attachEbiIds( element.childNodes[i], id);
        }
        
        return id;
    }
    
    attachEbiIds( document.querySelector("html"), 0);
})();
//countup
ebifly.log = function( val){
    this.socket.send( this.createLog( ebi.message.type.log, val));
};

ebifly.exception = function( val){
    this.socket.send( this.createLog( ebi.message.type.exception, val));
};

ebifly.result = function( val){ 
    this.socket.send( this.createLog( ebi.message.type.result, val));
};

ebifly.createLog = function( type, val){
    var obj = ebi.createMessageObject();
    obj.type = type;
    obj.msg = val;
    obj.origin = ebi.message.origin.client;
    return obj;
};
ebifly.executeScript = function( data){
    if( data.type == ebi.message.type.script){
        try{
            ebifly.result(eval( data.msg))
        }catch( exp){
            ebifly.execption(exp.message);
        }
    }
};  (function(){
    
    // start debug
    ebifly.connect( { host : "localhost",
                      port : 8080});

    
})();


/* powered by yaakaito */