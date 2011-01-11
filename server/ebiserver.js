var http = require("http"), url = require("url"),
    fs = require('fs'), io = require('socket.io'),
    sys = require(process.binding('natives').util ? 'util' : 'sys'), server;
    
server = http.createServer(function(req, res){

  var path = url.parse(req.url).pathname;
  switch (path){
  case "/":
      fs.readFile(__dirname + "/web/index.html", function( err, data){
          if( err){
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "text/html"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
      
  case "/console":
      fs.readFile(__dirname + "/web/console.html", function( err, data){
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
      fs.readFile(__dirname + "/web/" + path, function( err, data){
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
      fs.readFile(__dirname + "/../socket.io-client/" + path, function( err, data){
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
      console.log( path);
      fs.readFile(__dirname + "/web/image" + path, function( err, data){
          if( err){
              console.log(err);
              return send404( res);
          }
          res.writeHead( 200, {"Content-type": "image/png"});
          res.write(data, "utf-8");
          res.end();
      });
      break;
      
  case "/chat.html":
      fs.readFile(__dirname + "/../client/" + path, function( err, data){
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

server.listen(8080);

var io = io.listen(server), cache = [];  
io.on('connection', function(client){
   
    client.on('message', function(data){

        // Add Server Time
        data.st = (function( date){

	          var hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(), msec = date.getMilliseconds();
	          if( hour < 10){ hour = "0" + hour; }
	          if( min < 10){ min = "0" + min; }
	          if( sec < 10){ sec = "0" + sec; }
            if( msec < 10){ msec = "0" + msec}
            if( msec < 100){ msec = "0" + msec}
            
            return hour + ":" + min + ":" + sec + "." + msec;
        })( new Date());
        cache.push(data);
        if( cache.length > 30){
            cache.shift();
        }
        client.broadcast(data);
    });
    
    client.on('disconnect', function(){
        client.broadcast({ announcement: client.sessionId + ' disconnected' });
    });
});
