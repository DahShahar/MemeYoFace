var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static("public"));


var indico = new Object();
var key = JSON.parse(fs.readFileSync('indico/key.json', 'utf8'))[0];
indico.apiKey = key;
indico.fer = function(photo, callback) {
	//console.log(photo);
	//onsole.log(JSON.stringify({'data': photo.substr(0, 100)}));
	//console.log('https://apiv2.indico.io/fer?key=' + this.apiKey);
	request.post({url: 'https://apiv2.indico.io/fer?key=' + this.apiKey, form: {'data': photo}}, callback)
};

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memeyoface');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var addMeme;
db.once('open', function() {
  // we're connected!
  var memeStringSchema = mongoose.Schema({
		memeString: {type: String, required: true, unique: true},
		topEmotion: {type: String, required: true},
		secondEmotion: {type: String, required: true}

  });
	addMeme = function(mStr, top, second) {
		var meme = new MemeString({memeString: mStr, topEmotion: top, secondEmotion: second});
		meme.save(function(err, meme) {
			if(err) return console.error(err);
			console.log('stored meme: ' + mStr + ' ' + top + ' ' + second);
		});
	}
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




var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }


app.post('/photo', function(req, res) {
	var pic = req.body.photo;
	var pic64 = pic.split(',')[1] //strip off data:image/png;base64
    indico.fer(pic64, function(err, response, body) {
	if(err){
		err.log(err);
	}
	console.log(body);
  });
});


app.post('/newMeme', function(req, res) {
	console.log('recieved new meme');
	console.log(req.body);
	var memeString = req.body.memeString;
	var topEmotion = req.body.topEmotion;
	var secondEmotion = req.body.secondEmotion;
	addMeme(memeString, topEmotion, secondEmotion);
	res.send(memeString + ' ' + topEmotion + ' ' + secondEmotion);

});
app.listen(3000,function(){
  console.log("server start");
});

function addText(img, txt1, txt2){

  var imageObj = new Image();

  imageObj = function() {
    context.drawImage(imageObj, 69, 50);
    context.font = "40px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(txt1,canvas.width/2,100);
    context.fillText(txt2,canvas.width/2,canvas.height-100);
  };
  imageObj.src = img;

}
