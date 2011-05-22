ebifly.executeScript = function( data){
    if( data.type == EBI.message.type.script){
        try{
            ebifly.result(eval(data.msg))
        }catch( exp){
            ebifly.exception(exp.message);
        }
    }
};