// var indico = require('indico.io');
// var fs = require('fs');
// var express = require("express");
// var app = express();

//var key = JSON.parse(fs.readFileSync('../../indico/key.json', 'utf8'))[0]
//indico.apiKey = key;
// fs.readFile(function(err, data) {
  // base64data = new Buffer(data).toString('base64');
// });

// indico.fer(filename, base64data)
  // .then(function(res) {
    // console.log(res);
  // }).catch(function(err) {
    // console.warn(err);
  // });
 
 $.post(
 'https://apiv2.indico.io/fer?key=af2ed1cbeec6eada266d61cfc4f4c029',
 JSON.stringify({
   'data': "http://s.huffpost.com/contributors/lauren-galley/headshot.jpg"
 })
 

).then(function(res) { console.log(res) });
console.log("Test");