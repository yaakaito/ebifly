ebiconsole.insertLog = function( data){
    var area = $("message");
    if( data.type == EBI.message.type.log){
        area.innerHTML += "[" + data.time + "] " + data.msg + "\n";
    }else if( data.type == EBI.message.type.script){
        area.innerHTML += "<span class='script'>>>" + data.msg + "</span>\n";
    }else if( data.type == EBI.message.type.result){
        area.innerHTML += "<span class='result'>>>" + data.msg + "</span>\n";
    }else if( data.type == EBI.message.type.exception){
        area.innerHTML += "<span class='exception'>>>" + data.msg + "</span>\n";   
    }
    area.scrollTop = 100000000;

};

ebiconsole.clearLog = function(){
    $("message").innerHTML = "";
};
