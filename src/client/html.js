(function(){
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
