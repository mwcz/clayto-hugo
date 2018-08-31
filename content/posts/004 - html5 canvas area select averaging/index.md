---
Title: "HTML5 canvas area selection averaging"
Date: 2011-11-16
Tags:
 -  html5
 -  canvas
 -  color
 -  jsimage
 -  colorpal
 -  web
 -  javascript
thumbnail: thumb.jpg
aliases: /2011/11/16/html5-canvas-area-selection-averaging/
Mwc: 4
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

This is a demo from late 2009. It's an extension of the single-pixel [eyedropper](/2011/11/16/html5-canvas-eyedropper/) I wrote previously.

It's powered by an early version of an old JS toolkit I wrote called JSImage. The latest version is available at my [JSImage github repo](https://github.com/mwcz/jsimage). Don't be fooled by the 2011 commits, those are just artifacts from svn-&gt;git migration. No guarantees that the histo's are actually correct. :)

Click and drag to set the image border to the average of the selected pixels.

<img style="display: none !important;" src="kazoo.png">
<canvas id="c0">
    Your browser does not support the &lt;canvas&gt; element. Lame.
</canvas>

<style type="text/css">
    canvas {
        margin     : 0 auto;
        outline    : 36px solid black;
        margin     : 46px auto;
        transition : 0.1168s all ease;
        display    : block;
        cursor     : crosshair;
    }
</style>

<link rel="stylesheet" type="text/css" href="marker.css" />

<script type="text/javascript" src="marquee/prototype_reduced.js"></script>
<script type="text/javascript" src="marquee/rectmarquee.js"></script>
<script type="text/javascript" src="JSImage.js"></script>

<script type="text/javascript">

$(function() {

    images0 = new JSImage( "c0", "kazoo.png" );
    setTimeout(function(){images0.draggable();},100); // enable the selection

});

</script>
