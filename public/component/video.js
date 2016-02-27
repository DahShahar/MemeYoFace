(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 500; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getMedia({
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();

      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      // var data = canvas.toDataURL('image/png'); //image/png is the type param
      // var data64 = window.btoa(data);
      var data = ReImg.fromCanvas(document.getElementById('canvas')).toBase64();
      
      photo.setAttribute('src', data);
      $.ajax('/photo', {
        method: 'POST',
        data: {
          'photo': data
        }
      }).then(function(o, b, a) {
        // console.log(b); //string
        // console.log(a); //actual object
        // console.log(o); //success

        console.log(o);
        // var results = JSON.parse(o).results;
        // var maxSentimentVal = 0.0;
        // var maxSentimentEmotion = "";
        // for(var key in results) {
        //   if(results[key] > maxSentimentVal){
        //     maxSentimentVal = results[key];
        //     maxSentimentEmotion = key;
        //   }
        // }
        //
        // //POST reqest to backend pass in maxSentimentEmotion
        //
        // console.log(maxSentimentVal, maxSentimentEmotion)
        // var max = '';
        // for (var key in a.responseJSON) {
        //   console.log(key);
        // }
      });
    } else {
      clearphoto();
    }
    /*

        $.post(
          'https://apiv2.indico.io/fer?key=af2ed1cbeec6eada266d61cfc4f4c029',
          JSON.stringify({
            'data': "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/8/005/0a4/3fb/3906951.jpg"
          })
        ).then(function(res) {
          console.log(res);
        });*/
  }


  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
