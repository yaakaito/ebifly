ebiconsole.runScript = function(){
    
    var script = (function( script){
        var obj = ebi.createMessageObject();
        obj.type = ebi.message.type.script;
        obj.msg = script;
        obj.origin = ebi.message.origin.console;
        return obj;
    })($("script").value.replace(/^(.*?)\n*$/, "$1"));
    
    this.socket.send( script);
    this.insertLog( script);
    if( $("checkClearScript").checked){
        $("script").value = "";
    }
    
};
