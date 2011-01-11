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

    // HTML initialize
    var parent = document.querySelector("article#html > details > summary").parentNode;
    document.querySelector("article#html > details > summary").addEventListener( "click", function( parent){
        return function(){
            if( parent.getAttribute("open") === null){
                parent.setAttribute("open", "open");
                if( parent.getAttribute("loaded") === null){
                    ebiconsole.openHTMLTag( parent, ebiconsole.htmlModelObj.childNodes);
                    parent.setAttribute("loaded", "loaded");
                }
            }else{
                parent.removeAttribute("open");
            }
        }
    }( parent), false);


    this.htmlModelObj= document.querySelector("html");
};

ebiconsole.openHTMLTag = function( targetDetails, newNodes){

    var details, summary, text,  i = 0, len = newNodes.length;
    for(; i < len; i++){
        if( newNodes[i] !== null && newNodes[i] !== undefined){
            details = document.createElement("details");
            summary = document.createElement("summary");
            if( newNodes[i] instanceof HTMLElement){
                summary.appendChild( document.createTextNode( "<" + newNodes[i].tagName.toLowerCase() + ">"));
                details.setAttribute( "tag", "tag");
                summary.addEventListener("click",function( details, children){
                    return function(){
                        if( details.getAttribute("open") === null){
                            details.setAttribute("open", "open");
                            if( details.getAttribute("loaded") === null){
                                ebiconsole.openHTMLTag( details, children);
                                details.setAttribute("loaded", "loaded");
                            }
                        }else{
                            details.removeAttribute("open");
                        }
                    };
                }( details, newNodes[i].childNodes));
            }else{
                summary.appendChild( document.createTextNode( newNodes[i].nodeValue));
            }
            details.appendChild( summary);
            targetDetails.appendChild( details);
        }
    }
    
};

/* 
   console runScript
*/
ebiconsole.runScript = function(){

    var script = this.message.createScript( $("script").value.replace(/^(.*?)\n*$/, "$1"));
    this.socket.send( script);
    this.insertScript( script);
    if( $("checkClearScript").checked){
        $("script").value = "";
    }
    
}

/* 
   console events
*/
ebiconsole.event.message = function( data){

    // Add mother time
    data.mt = ebiconsole.message.createTimeString( new Date());

    // rewrite message last id
    ebiconsole.message.last = +data.last;

    
    if( data.type == "LOG"){
        // insert log
        ebiconsole.insertLog( data);
    }else if( data.type == "RES"){
        // insert result
        ebiconsole.insertResult( data);
    }else if( data.type == "EXP"){
        // insert exception
        ebiconsole.insertException( data);
    }
};

ebiconsole.event.clickHTMLDetails = function( e){

    var parent = e.parentNode;
    alert( e.parentNode);
    alert( parent.getAttribute("open"));
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
  ebiconsole controllers
*/
ebiconsole.insertLog = function( log){

    var console = $("message");
    console.innerHTML += this.createLogTimesString( log) + " " + log.msg + "\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.insertScript = function( log){

    var console = $("message");
    console.innerHTML += "<span class='script'>>> " + log.msg + "</span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.insertResult = function( log){

    var console = $("message");
    console.innerHTML += "<span class='result'>>> " + log.msg + "</span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.insertException = function( log){

    var console = $("message");
    console.innerHTML += "<span class='exception'>>> "  + log.msg + "<span>\n";
    console.scrollTop = 1000000000;
    
};

ebiconsole.createLogTimesString = function( data){

    var tlist = ["ct"], target, i = 0, len, results = [];
    for( len = tlist.length; i < len; i++){
        results.push( data[tlist[i]]);
    }
    return "[" + results.join("|") + "]";
}

ebiconsole.clearLog = function(){

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