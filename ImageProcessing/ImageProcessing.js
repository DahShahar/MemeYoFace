window.onload = function() {
  var canvas = document.getElementById("image");
  var context = canvas.getContext("2d");
  var imageObj = new Image();
  imageObj.onload = function() {
    context.drawImage(imageObj, 10, 10);
    context.font = "20px Calibri";
    context.fillText("My TEXT!", 50, 200);

    /// create an anchor/link (or use an existing)
    var lnk = document.createElement('a');

    /// set your image as data-uri link
    lnk.href = canvas.toDataURL();

    /// and the key, when user click image will be downloaded
    lnk.download = 'filename.png';

    /// add lnk to DOM, here after the canvas
    canvas.parentElement.appendChild(lnk);
  };
  imageObj.src = "mail-image.jpg";
};
