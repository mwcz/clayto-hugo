---
Title: "HTML5 Canvas eyedropper"
Date: 2011-11-16
thumbnail: thumb.jpg
aliases: /2011/11/16/html5-canvas-eyedropper/
Tags:
 -  html5
 -  canvas
 -  color
 -  colorpal
 -  web
description: "An HTML5 Canvas eyedropper."
Mwc: 1
---

<style type="text/css">
    canvas {
        margin        : 0 auto;
        border-width  : 36px;
        border-style  : solid;
        border-radius : 16px;
        transition    : 0.1168s all ease;
        margin        : 0 auto;
        display       : block;
        cursor        : crosshair;
    }
</style>

<img style="display: none !important;" src="kazoo.png">

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">

$(function() {
var c;
var cnvs = document.getElementById("c");

if( cnvs.getContext) { // Check for canvas support
// DRAW FUN STUFF!

    c = cnvs.getContext('2d');
    var color = document.getElementById("color");
    var colorcode = document.getElementById("colorcode");

    var images = new Image();

    images.onload = function() {
        cnvs.width = images.width;cnvs.height = images.height; // resize to fit image
        c.drawImage( images, 0, 0 );
    }
    images.src = "kazoo.png";

    pixel = function(e) {

        // find the element's position
        var x = 0;
        var y = 0;
        var o = cnvs;
        do {
            x += o.offsetLeft;
            y += o.offsetTop;
        } while (o = o.offsetParent);

        x = e.pageX - x - 36; // 36 = border width
        y = e.pageY - y - 36; // 36 = border width
        var imagesdata = c.getImageData( x, y, 1, 1 );
        var new_color = [ imagesdata.data[0], imagesdata.data[1], imagesdata.data[2] ];
        cnvs.style.borderColor = "rgb("+new_color+")";
        colorcode.textContent = "Pixel color: rgb("+new_color+")";
    }

    cnvs.onmousedown = function(e) {
        cnvs.onmousemove = pixel; // fire pixel() while user is dragging
        cnvs.onclick = pixel; // only so it will still fire if user doesn't drag at all
    }

    cnvs.onmouseup = function() {
        cnvs.onmousemove = null;
    }

}
});

</script>

This is an old demo I made of an [HTML5 canvas](http://en.wikipedia.org/wiki/Canvas_element) eyedropper. Circa 2009, I believe. Just click and drag on the image to see it in action.

<code id="colorcode"></code>

<canvas id="c">Sorry, in order to view this demo you need a Web browser that supports HTML5 canvas.</canvas>

<br>

It's a pretty simple script, and works by declaring this function which handles onclick and ondrag events from the canvas. cnvs is the canvas element, and c is the canvas's 2D rendering context object.

```js
function pixel(e) {
  // calculate the x and y coordinates of the cursor
  var imagesdata = c.getImageData(x, y, 1, 1);
  var new_color = [imagesdata.data[0], imagesdata.data[1], imagesdata.data[2]];
  color.style.background = "rgb(" + new_color.join() + ")";
}
```

That's just a summary; the function actually does a little more than that. Take a look at the source for this page if you're interested.
