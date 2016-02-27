var indico = require('indico.io');
var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static("public"));


var key = JSON.parse(fs.readFileSync('indico/key.json', 'utf8'))[0];
indico.apiKey = key;

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }


app.post('/photo', function(req, res) {

  indico.fer(req.body.photo)
    .then(function(data) {
      res.json(data);
    }).catch(function(err) {
      console.warn(err);
    });
});

app.listen(3000, function() {
  console.log("server start");
});
