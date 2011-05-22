var ebiconsole = {

    event : {
        
    },
    socket : null,
    message : {

        last : 0
    },
    last : 0,
    htmlModelObj : null
};

ebiconsole.connect = function( options){

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
     //   ebiconsole.event.connect( evt);
    });
    this.socket.on( "message", function( msg){
        ebiconsole.event.message( msg);
    });
    this.socket.on( "disconnect", function( evt){
     //   ebiconsole.event.disconnect( evt);
    });


    // Add Events
    $("runscript").addEventListener("click", function(){ebiconsole.runScript()});
    $("clearlogs").addEventListener("click", function(){ebiconsole.clearLog()});

    $("script").addEventListener("keyup", function( e){
        if( e.keyCode === 13 && $("checkReturnScript").checked){
            ebiconsole.runScript();
        }
    });

    // Request HTML
    this.socket.send( this.message.createRequestHTML());
    
    // HTML initialize
    var parent = document.querySelector("article#html > section > details");
    document.querySelector("article#html > section > details > summary").addEventListener( "click", function( target){
        return function(){
            if( !target.getAttribute("open")){
                target.setAttribute("open", "open");
            }else{
                target.removeAttribute("open");
            }
        }
    }( parent), false);

};

ebiconsole.updateHTMLTag = function(){

    
}

ebiconsole.selectNode = function( path){
    
    var ary = path.split(","), i=1, len = ary.length, now = this.htmlModelObj, n;
    if(len==1){
        return this.htmlModelObj;
    }
    
    for(;i<len;i++){
        n = ary[i];
        if( now.children.length > n){
            now = now.children[n];
        }else{
            return null;
        }
    }
    return now;
};

/* 
   console events
*/
ebiconsole.event.message = function( data){

    // Add mother time
    data.mt = ebiconsole.message.createTimeString( new Date());

    // rewrite message last id
    ebiconsole.message.last = +data.last;

    
    if( data.type == EBI.message.type.log){
        // insert log
        ebiconsole.insertLog( data);
    }else if( data.type == EBI.message.type.result){
        // insert result
        ebiconsole.insertLog( data);
    }else if( data.type == EBI.message.type.exception){
        // insert exception
        ebiconsole.insertLog( data);
    }else if( data.type == EBI.message.type.sendHTML){
        ebiconsole.updateHTML( data);
    }
};

ebiconsole.event.clickHTMLDetails = function( e){

    var parent = e.parentNode;
    /*
    alert( e.parentNode);
    alert( parent.getAttribute("open"));
    */
}
/*
  ebiconsole message format
*/

ebiconsole.message.createLog = function( val){
    var base = this.createBase();
    base.type = "LOG";
    base.msg = val;
    return base;
};

ebiconsole.message.createRequestHTML = function(){
    var base = this.createBase();
    base.type = "RHT";
    return base;
}

ebiconsole.message.createBase = function(){
    return {
        id: this.last++,
        type: null,
        org: "c", //Client
        msg: "base message",
        mt: this.createTimeString( new Date()),
        st: null,
        ct: null
    };
};


ebiconsole.message.createTimeString = function( date){

	  var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	  if( hour < 10){ hour = "0" + hour; }
	  if( min < 10){ min = "0" + min; }
	  if( sec < 10){ sec = "0" + sec; }
    if( msec < 10){ msec = "0" + msec; }
    if( msec < 100){ msec = "0" + msec; }
    
    return hour + ":" + min + ":" + sec + "." + msec;
}
var $ = function( id){

    return document.getElementById( id);
};

(function(){
    
    // start debug
    ebiconsole.connect( { host : "localhost",
                          port : 8080});

})();