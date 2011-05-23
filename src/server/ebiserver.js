var http = require("http"), url = require("url"),
    fs = require('fs'), io = require('socket.io'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'),
    server,send404, equalHTMLJSONs;

console.log("---- Welcome to ebifly! ----");
server = http.createServer(function(req, res){

  var path = url.parse(req.url).pathname;
  switch (path){
  case "/":
  case "/console":
      fs.readFile(__dirname + "/console/console.html", function( err, data){
          if( err){
              
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "text/html"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
      
  case "/console.css":
  case "/console.js":
      fs.readFile(__dirname + "/console" + path, function( err, data){
          if( err){
              return send404( res);
          }
          if( path == "/console.css"){
              res.writeHead( 200, {"Content-type": "text/css"});
          }else{
              res.writeHead( 200, {"Content-type": "text/javascript"});
          }
          res.write(data, "utf-8");
          res.end();
      });
      break;
      
  case "/socket.io.js":
      fs.readFile(__dirname + "/socket.io-client/" + path, function( err, data){
          if( err){
              console.log(err);
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "text/javascript"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
  case "/arrow_right.png":
  case "/arrow_bottom.png":
      fs.readFile(__dirname + "/console" + path, function( err, data){
          if( err){
              console.log(err);
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "image/png"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
      
  case "/sample.html":
      console.log("hoge");
      fs.readFile(__dirname + "/../client" + path, function( err, data){
          if( err){
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "text/html"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
  case "/ebiclient.js":
  case "/ebifly.js":
      fs.readFile(__dirname + "/../client/ebifly.js", function( err, data){
          if( err){
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "text/javascript"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
    
  default: 
      send404(res);
      break;
  }
}),

// TODO:
send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

equalHTMLJSONs = function( before, after){

    if( before == null || after == null){ return false; }
    if( before.str !== after.str){
        return false;
    }
    if( !(before.tag === "TextNode" || after === "TextNode")){
        for( var i= 0, len = before.children.length; i < len; i++){
            if( !equalHTMLJSONs( before.children[i], after.children[i])){
                return false;
            }
        }
    }
    return true;
};

server.listen(8080);

var io = io.listen(server), cache = [], htmlCache = null;

io.on('connection', function(client){
    client.on('message', function(data){
        // Add Server Time
        client.broadcast(data);
        
/*
        data.st = (function( date){

	          var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	          if( hour < 10){ hour = "0" + hour; }
	          if( min < 10){ min = "0" + min; }
	          if( sec < 10){ sec = "0" + sec; }
            if( msec < 10){ msec = "0" + msec}
            if( msec < 100){ msec = "0" + msec}
            
            return hour + ":" + min + ":" + sec + "." + msec;
        })( new Date());

        if( data.type === "HTM"){
            //test mode
            if( !equalHTMLJSONs( htmlCache, data.msg) || data.broadcast == true){
                client.broadcast(data);
            }
            htmlCache = data.msg;
        }else{
            cache.push(data);
            if( cache.length > 30){
                cache.shift();
            }
            client.broadcast(data);
        }
*/
    });
    
    client.on('disconnect', function(){
        client.broadcast({ announcement: client.sessionId + ' disconnected' });
    });
});
