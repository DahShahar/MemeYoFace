var fs = require('fs');
var express = require("express");
var app = express();
app.use(express.static("public"));
app.listen(3000,function(){
  console.log("server start");
});
//var key = JSON.parse(fs.readFileSync('indico/key.json', 'utf8'))[0]
