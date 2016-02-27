var fs = require('fs');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memeyoface');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  var memeStringSchema = mongoose.Schema({
		memeString: {type: String, required: true, unique: true},
		topEmotion: {type: String, required: true},
		secondEmotion: {type: String, required: true}
		
  });

  var MemeString = mongoose.model('MemeString', memeStringSchema);
  var meme1 = new MemeString({memeString: 'I am happy', topEmotion: 'happy', secondEmotion: 'neutral'});
  // meme1.save(function(err, meme1) {
	// if(err) return console.error(err);
	// console.log('stored meme1: ' + meme1);
  // });
  
  MemeString.find(function(err, memes) {
	if(err) return console.error(err);
	console.log(memes);
  });
  
  });
app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/photo', function(req, res) {
  console.log(req);
});
app.post('/newMeme', function(req, res) {
	console.log('recieved new meme');
	console.log(req.body);
	var memeString = req.body.memeString;
	var topEmotion = req.body.topEmotion;
	var secondEmotion = req.body.secondEmotion;
	res.send(memeString + ' ' + topEmotion + ' ' + secondEmotion);
});
app.listen(3000,function(){
  console.log("server start");
});
//var key = JSON.parse(fs.readFileSync('indico/key.json', 'utf8'))[0]