ebifly.attachEbiId = function( element, id){
    if( element.tagName === null || element.tagName === undefined){
        return id;
    }
    
    element.setAttribute("ebifly", id++);
    var i = 0, len = element.childNodes.length;
    for( ; i < len; i++){
        id = this.attachEbiId( element.childNodes[i], id);
    }
    
    return id;
};
  
(function(){ 
    ebifly.lastEbiId =  ebifly.attachEbiId( document.querySelector("html"), 0);
})();

ebifly.sendHTML = function(){

    var html = document.querySelector("html"),
        hash = CybozuLabs.MD5.calc( html),
        ebiHTML = null;
    if( this.lastHTMLHash == null || this.lashHTMLHash !== hash){
        this.socket.send( 
            (function( ebiHTML){
                var obj = EBI.createMessageObject();
                obj.type = EBI.message.type.sendHTML;
                obj.msg = ebiHTML;
                obj.origin = EBI.message.origin.client;
                return obj;
            })( this.elementToEbiHTML( html))
        );
    }
    this.lastHTMLHash = hash;
};

ebifly.elementToEbiHTML = function(element){
    if( element.tagName === null || element.tagName === undefined){
        return {
            type : EBI.html.type.textNode,
            tag : null,
            attributes : [],
            children : [],
            value : element.nodeValue
        };
    }
    
    var ebiId = element.getAttribute("ebifly"),
        obj = {
            type : EBI.html.type.tag,
            tag : element.tagName.toLowerCase(),
            attributes : [],
            children : []
        },
        attr = function( name, value){ return { name : name, value : value};},
        i = 0, len;
    if( ebiId === null || ebiId === undefined){
        this.attachEbiId( element, this.lastEbiId);
    }
    obj.id = parseInt( element.getAttribute("ebifly"));
    for( len = element.attributes.length; i < len; i++){
        if( element.attributes[i].name !== "ebifly"){
            obj.attributes.push( 
                attr( element.attributes[i].name, element.attributes[i].value)
            );
        }
    }

    for( i = 0, len = element.childNodes.length; i < len; i++){
        obj.children.push( this.elementToEbiHTML( element.childNodes[i]));
    }

    return obj;
};
