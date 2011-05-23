ebiconsole.updateHTML = function( data){

    //this.htmlModelObj = data.msg;
    if( !this.registeredHTML){
        this.registerHTML( data.msg,
                           document.querySelector("article#html > section > details")
                         );
        this.registeredHTML = true;
    }else{
        this.remakeHTML(
            data.msg,
            this.htmlModelObj,
            document.querySelector("article#html > section > details")
        );
    }

    this.htmlModelObj = data.msg;
};

ebiconsole.registerHTML = function( ebiElement, tagElement){
    
    var i = 0, children = ebiElement.children, len = children.length;
    for(; i < len; i++){
        var details = document.createElement("details"), summary = document.createElement("summary");
        if( children[i].type == EBI.html.type.tag){
            var tagStr = "&lt;" + children[i].tag,
                attr = children[i].attributes, l = 0, attrLen = attr.length;
            for(; l < attrLen; l++){
                tagStr += " <span class='name'>" + attr[l].name + "</span>=<span class='value'>\"" + attr[l].value + "\"</span>";
            }
            summary.innerHTML = tagStr + ">";
            details.setAttribute("tag", "tag");
            details.setAttribute("ebifly", children[i].id);
            details.appendChild( summary);
            tagElement.appendChild( details);
            summary.addEventListener("click", function( target){
                return function(){
                    if( !target.getAttribute("open")){
                        target.setAttribute("open", "open");
                    }else{
                        target.removeAttribute("open");
                    }   
                }
            }( details));
            if( !( children[i].children.length > 0)){
                details.setAttribute("last", "last");
            }else{
                this.registerHTML( children[i], details);
            }
        }else{
            var details = document.createElement("details"), summary = document.createElement("summary");
            summary.innerHTML = "<span class='textnode'>" + children[i].value + "</span>";
            details.appendChild( summary);
            tagElement.appendChild( details);
        }
    }
};


// TODO:flash!!!!!
ebiconsole.remakeHTML = function( ebiElement, oldElement, tagElement){
    
    var i = 0, ebiChildren = ebiElement.children,   ebiLen = ebiChildren.length,
               oldChildren = oldElement.children,   oldLen = oldChildren.length,
               selfUpdate = false;

    console.log(tagElement);
    console.log(tagElement.childNodes.length);
    if( ebiLen != oldLen){
        tagElement.innerHTML = "";
        this.registerHTML( ebiElement, tagElement);
        return;
    }

    for( var i = 0; i < ebiLen; i++){
        
        var newObj = ebiChildren[i], oldObj = oldChildren[i],
            update = false;
        if( newObj.id != oldObj.id){
            tagElement.innerHTML = "";
            this.registerHTML( ebiElement, tagElement);
            break;
        }else{
            if( newObj.attributes.length != oldObj.attributes.length){
                update = true;
            }else{
                var newAttr = newObj.attributes, oldAttr = oldObj.attributes;
                for( var l = 0; l < newAttr.length; l++){
                    if( newAttr[l].name !== oldAttr[l].name){
                        update = true;
                        break;
                    }else if( newAttr[l].value !== oldAttr[l].value){          
                        update = true;
                        break;
                    }
                }
            }

            if( newObj.value !== oldObj.value){
                update = true;
            }

            var details = EBI.getChildren( tagElement)[i+1],
                summary = details.childNodes[0];

            if(update){
                if( newObj.type == EBI.html.type.tag){
                    var tagStr = "&lt;" + newObj.tag,
                    attr = newObj.attributes, l = 0, attrLen = attr.length
                    for(; l < attrLen; l++){
                        tagStr += " <span class='name'>" + attr[l].name + "</span>=<span class='value'>\"" + attr[l].value + "\"</span>";
                    }
                    summary.innerHTML = tagStr + ">";
                    if( !( newObj.children.length > 0)) {
                        details.setAttribute("last", "last");
                    }
                }else{
                    summary.innerHTML = "<span class='textnode'>" + newObj.value + "</span>";
                }
            }

            if(newObj.children.length > 0){
                this.remakeHTML( newObj, oldObj, details);
            }
        }
    }
};

ebiconsole.toggleHTMLTag = function( target){
    
    if( !!target.getAttribute("open")){
        target.setAttribute("open", "open");
    }else{
        target.removeAttribute("open");
    }
};
