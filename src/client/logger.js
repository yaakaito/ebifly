ebifly.log = function( val){
    this.socket.send( this.createLog( EBI.message.type.log, val));
};

ebifly.exception = function( val){
    this.socket.send( this.createLog( EBI.message.type.exception, val));
};

ebifly.result = function( val){ 
    this.socket.send( this.createLog( EBI.message.type.result, val));
};

ebifly.createLog = function( type, val){
    var obj = EBI.createMessageObject();
    obj.type = type;
    obj.msg = val;
    obj.origin = EBI.message.origin.client;
    return obj;
};
