---
Title: "HTML5 canvas RGB histogram"
Date: 2011-11-16
Tags:
 -  html5
 -  canvas
 -  color
 -  jsimage
 -  web
 -  javascript
thumbnail: thumb.jpg
aliases: /2011/11/16/html5-canvas-rgb-histogram/
Mwc: 3
---

This is yet another demo from around 2009. It's simple enough. Click a
button, draw an unbinned RGB histogram of the source image.

It's powered by an early version of an old JS toolkit I wrote called JSImage.
The latest version is available at my [JSImage github
repo](https://github.com/mwcz/jsimage). Don't be fooled by the 2011 commits,
those are just artifacts from svn-&gt;git migration. No guarantees that the
histo's are actually correct. :)

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<img style="display: none !important;" src="kazoo.png">

## Original image

<canvas id="c0">
    Your browser does not support the &lt;canvas&gt; element. Lame.
</canvas>

<input type="button" onclick="draw_histo()" value="Draw histograms" />

<div class="row">
<div class="col-xs-12 col-sm-4">
<div class="panel panel-default">
<div class="panel-heading">
<b>Red</b>
</div>
<div class="panel-body">
<canvas class="img-responsive" id="cr">
Your browser does not support the &lt;canvas&gt; element. Lame.
</canvas>
</div>
</div>
</div>
<div class="col-xs-12 col-sm-4">
<div class="panel panel-default">
<div class="panel-heading">
<b>Green</b>
</div>
<div class="panel-body">
<canvas class="img-responsive" id="cg">
Your browser does not support the &lt;canvas&gt; element. Lame.
</canvas>
</div>
</div>
</div>
<div class="col-xs-12 col-sm-4">
<div class="panel panel-default">
<div class="panel-heading">
<b>Blue</b>
</div>
<div class="panel-body">
<canvas class="img-responsive" id="cb">
Your browser does not support the &lt;canvas&gt; element. Lame.
</canvas>
</div>
</div>
</div>
</div>

I'm pretty sure the results are wrong, but here, years later, I can't be bothered to fix it. ;)

<script type="text/javascript" src="JSImage.js"></script>
<script type="text/javascript">

var draw_histo;
$(function () {

    var images0 = new JSImage( "c0", "kazoo.png" );
    var imagesr = new JSImage( "cr", "kazoo.png" );
    var imagesg = new JSImage( "cg", "kazoo.png" );
    var imagesb = new JSImage( "cb", "kazoo.png" );

    draw_histo = function () {

        /**
         * Color histo canvases the color of their histo
         */
        images0.histo( imagesr.canvas, 'r', 'rgba(255,0,0,0.9)', 'rgba(0,0,0,0.8)' );
        images0.histo( imagesg.canvas, 'g', 'rgba(0,200,0,0.9)', 'rgba(0,0,0,0.8)' );
        images0.histo( imagesb.canvas, 'b', 'rgba(0,0,200,0.9)', 'rgba(0,0,0,0.8)' );

    };


});
</script>
