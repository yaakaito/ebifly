ebiconsole.updateHTML = function( data){

    //this.htmlModelObj = data.msg;
    this.registerHTML( data.msg,
                       document.querySelector("article#html > section > details")
                     );
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
            this.registerHTML( children[i], details);
        }else{
            var details = document.createElement("details"), summary = document.createElement("summary");
            summary.innerHTML = "<span class='textnode'>" + children[i].value + "</span>";
            details.appendChild( summary);
            tagElement.appendChild( details);
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
/*
    var details, summary, text, children = this.selectNode(now).children,
        i = 0, len = children.length,
        tagStr, j, attr, path;
    for(; i < len; i++){
        path = nowpath + "," + i;
        if( children[i] !== null && children[i] !== undefined){
            details = document.createElement("details");
            summary = document.createElement("summary");
            if( children[i].type != EBI.html.type.textNode){
                tagString = "&lt;" + children[i].tag;
                for(j = 0, attrLen = children[i].attributes.length; j < attrLen; j++){
                    tagString += " <span class=\"name\">" + children[i].attributes[j].name + "</span>=<span class=\"value\">\"" + children[i].attributes[j].value + "\"</span>";
                }
                tagString += ">";
                summary.innerHTML = tagString;
                details.setAttribute( "tag", "tag");
                if( children[i].children.length > 0){
                    summary.addEventListener("click",function( details, nowpath){
                        return function(){
                            var smry = details.childNodes[0];
                            details.innerHTML = "";
                            details.appendChild(smry);
                            if( details.getAttribute("open") === null){
                                details.setAttribute("open", "open");
                                if( details.getAttribute("loaded") === null){
                                    ebiconsole.openHTMLTag( details, nowpath);
                                }
                            }else{
                                details.removeAttribute("open");
                            }
                        };
                    }( details, path));
                }else{
                    details.setAttribute("last", "last");
                }
            }else{
                summary.appendChild( document.createTextNode( children[i].value));
            }
            details.appendChild( summary);
            targetDetails.appendChild( details);
        }
    }    
    
};

ebiconsole.selectNode = function( path){
    
    var ary = path.split(","), i=1, len = ary.length, now = this.htmlModelObj, n;
    if(len==1){
        return this.htmlModelObj;
    }
    
    for(;i<len;i++){
        n = ary[i];
        if( now.children.length > n){
            now = now.children[n];
        }else{
            return null;
        }
    }
    return now;
};

*/