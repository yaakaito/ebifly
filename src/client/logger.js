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
