var fs = require('fs');
var express = require("express");
var bodyParser = require("body-parser");
// var smartcrop = require("smartcrop")
var request = require("request");
var app = express();
var trainingdata = require("./convertTrainingSet");
var caption = require("caption");

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

function sendToIndico(endpoint, data, callback) {
  var key =  indico.apiKey;
    collectionName = 'wuttt';
    url = 'https://apiv2.indico.io'+ endpoint +'key='+ key;
  request.post({url: url, form: {'data': data, 'collection': collectionName}}, callback);
}

//sendToIndico('/custom/clear_collection?', {}, function(err) {if(err) console.error(err);});


//console.log(trainingdata.getTrainingData().length);//trainingdata.getTrainingData()
// sendToIndico('/custom/add_data?',['d', 'a'] , function(err, a, status) {
	// if(err) return console.error('Error training: ' + err);
	//if(a) console.log(a);
	// if(status) console.log(status);
// });

// sendToIndico('/custom/train?', {}, function(err, a, status) {
	// if(err) return console.error('Error training: ' + err);
	//if(a) console.log(a);
	// if(status) console.log(status);
// });

/* sendToIndico('/custom/predict?', "The hackathon is almost over", function(err, a, status) {
	if(err) return console.error('Error predicting: ' + err);
	//if(a) console.log(a);
	if(status) console.log(status);
}); */






var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memeyoface');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var addMeme;
var findRandStringMatch;
db.once('open', function() {
  // we're connected!
  var memeStringSchema = mongoose.Schema({
		memeString: {type: String, required: true, unique: true},
		topEmotion: {type: String, required: true},
  });
	addMeme = function(mStr, top) {
		var meme = new MemeString({memeString: mStr, topEmotion: top});
		meme.save(function(err, meme) {
			if(err) return console.error(err);
			console.log('stored meme: ' + mStr + ' ' + top);
		});
	}
  var MemeString = mongoose.model('MemeString', memeStringSchema);
  //var meme1 = new MemeString({memeString: 'I am happy', topEmotion: 'happy'});
  // meme1.save(function(err, meme1) {
	// if(err) return console.error(err);
	// console.log('stored meme1: ' + meme1);
  // });

  // MemeString.find(function(err, memes) {
	// if(err) return console.error(err);
	//console.log(memes);
  // });







var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/photo', function(req, res) {
	var pic = req.body.photo;
	var pic64 = pic.split(',')[1] //strip off data:image/png;base64
    indico.fer(pic64, function(err, response, body) {
	if(err){
		err.log(err);
	}
	console.log(body);

  var results = JSON.parse(body).results;
  var maxSentimentVal = 0.0;
  var maxSentimentEmotion = "";
  for(var key in results) {
    if(results[key] > maxSentimentVal){
      maxSentimentVal = results[key];
      maxSentimentEmotion = key;
    }
  }
	var query = MemeString.find({'topEmotion': maxSentimentEmotion});
	query.select('memeString');
	query.exec(function(err, meme) {
	if(err) return console.error(err);
	mStr = meme[getRandomInt(0, meme.length)].memeString;
	console.log(mStr);
  console.log(maxSentimentVal, maxSentimentEmotion)


  res.json(mStr);//send back meme string
  });



	});



});


app.post('/newMeme', function(req, res) {
	//console.log('recieved new meme');
	//console.log(req.body);
	var memeString = req.body.memeString;
	var topEmotion = req.body.topEmotion;
	addMeme(memeString, topEmotion);
	res.send(memeString + ' ' + topEmotion);

});

app.post('/newText', function(req, res) {
	console.log(req.body);
	var mt = req.body.memeText;
	if(mt) {
		sendToIndico('/custom/predict?', mt, function(err, a, status) {
		if(err) return console.error('Error predicting: ' + err);
		if(status) {
			 var results = JSON.parse(status).results;
			var maxSentimentVal = 0.0;
			var maxSentimentEmotion = "";
			for(var key in results) {
				if(results[key] > maxSentimentVal){
					maxSentimentVal = results[key];
					maxSentimentEmotion = key;
					addMeme(mt, maxSentimentEmotion);
				}
			}
			res.send(mt);
		}

});

}});

// addMeme("I'm Happy!", "Happy");
// addMeme("The world is out to get me", "Sad");
// addMeme("I'm hangry!", "Angry");
// addMeme("I'm afeared!", "Fear");
// addMeme("wut?!", "Surprise");
// addMeme("I'm Boring!", "Neutral");
addMeme("I'm crying with my eyes.", "Sad");
addMeme("I'm lonely.", "Sad");
addMeme("I love caffeine!", "Happy");
addMeme("I love dank memes!", "Happy");
addMeme("I worry. A lot.", "Nervous");
addMeme("I wish I was somewhere else.", "Nervous");
addMeme("These creators are so smart!", "Happy");
addMeme("Country music makes me mad.", "Angry");

//findRandStringMatch("Happy", );
app.listen(3000,function(){
  console.log("server start");
});
});
