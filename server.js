var http = require('http');

var proxy = http.createServer(function(req, res){
    console.log(req.method);
    options = {
      host:"192.168.1.25",
      port:"9999",
      path:req.url,
      method:req.method,
      headers:{
        "Content-type":"application/json; charset=utf-8"
      }
    };
  var sreq = http.request(options, function(sres){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "application/json; charset=utf-8");
    sres.pipe(res);
    sres.on("end", function(){
    //   console.log("done");
    })
  });
  if(/POSTIPUT/i.test(req.method)){
    req.pipe(sreq);
  }else{
    sreq.end();
  }
}).listen(9999);
console.log("server started on!");
