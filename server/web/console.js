var ebiconsole = {

    event : {
        
    },

    socket : null,

    message : {

        last : 0
    },

    last : 0,
    
    ui : {
    
        logTable : document.getElementById( "logtable")
    }
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
    $("clearlogs").addEventListener("click", function(){ebiconsole.ui.clearLog()});

    $("script").addEventListener("keyup", function( e){
        if( e.keyCode === 13 && $("checkReturnScript").checked){
            ebiconsole.runScript();
        }
    });
};

/* 
   console runScript
*/
ebiconsole.runScript = function(){

    var script = this.message.createScript( $("script").value.replace(/^(.*?)\n*$/, "$1"));
    this.socket.send( script);
    this.ui.insertScript( script);
    if( $("checkClearScript").checked){
        $("script").value = "";
    }
    
}

/* 
   cosole events
*/
ebiconsole.event.message = function( data){

    // Add mother time
    data.mt = ebiconsole.message.createTimeString( new Date());

    // rewrite message last id
    ebiconsole.message.last = +data.last;

    
    if( data.type == "LOG"){
        // insert log
        ebiconsole.ui.insertLog( data);
    }else if( data.type == "RES"){
        // insert result
        ebiconsole.ui.insertResult( data);
    }else if( data.type == "EXP"){
        // insert exception
        ebiconsole.ui.insertException( data);
    }
};
/*
  ebiconsole message format
*/

ebiconsole.message.createLog = function( val){
    var base = this.createBase();
    base.type = "LOG";
    base.msg = val;
    return base;
};

ebiconsole.message.createScript = function( script){
    var base = this.createBase();
    base.type = "SCR";
    base.msg = script;
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

/*
  ebiconsole UI controllers
*/
ebiconsole.ui.insertLog = function( log){

    var console = $("console");
    console.innerHTML += this.createLogTimesString( log) + " " + log.msg + "\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.ui.insertScript = function( log){

    var console = $("console");
    console.innerHTML += "<span class='script'>>> " + log.msg + "</span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.ui.insertResult = function( log){

    var console = $("console");
    console.innerHTML += "<span class='result'>>> " + log.msg + "</span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.ui.insertException = function( log){

    var console = $("console");
    console.innerHTML += "<span class='exception'>>> "  + log.msg + "<span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.ui.createLogTimesString = function( data){

    var tlist = ["ct"], target, i = 0, len, results = [];
    for( len = tlist.length; i < len; i++){
        results.push( data[tlist[i]]);
    }
    return "[" + results.join("|") + "]";
}

ebiconsole.ui.clearLog = function(){

    $("console").innerHTML = "";
}

var $ = function( id){

    return document.getElementById( id);
};

(function(){
    
    // start debug
    ebiconsole.connect( { host : "localhost",
                          port : 8080});

})();