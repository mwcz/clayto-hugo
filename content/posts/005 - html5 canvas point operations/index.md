---
Title: "HTML5 canvas point operations"
Date: 2011-11-17
Tags:
 -  html5
 -  canvas
 -  color
 -  image processing
 -  jsimage
 -  web
 -  javascript
thumbnail: thumb.jpg
aliases: /2011/11/17/html5-canvas-point-operations/
Mwc: 5
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

This is the last demo I made using [JSImage](https://github.com/mwcz/jsimage). I created it some time around 2009-2010. At the time, I had checked out an [imaging book](http://www.amazon.com/Digital-Image-Processing-Algorithmic-Introduction/dp/1846283795) from my university's library at least ten times. Most of the exercises in that book I implemented in Python using [PIL](http://www.pythonware.com/products/pil/), but point operations were simple enough to port to JavaScript quickly.

Point operations are image alterations that affect all pixels equally. Other operations, like blurring for example, each result pixel depends on adjacent pixels.

This demonstrates changing contrast, value, saturation, hue, color inversion, and threshold point operations. Note that there is a bug with increasing value and increasing saturation which I never got around to fixing.

<script type="text/javascript" src="jsimage.js"></script>
<script type="text/javascript" src="colorspace.js"></script>
<img style="display: none !important;" src="bee.jpg">

<script type="text/javascript">

    var IJS_PointOps;
    $(document).ready( function() {
        IJS_PointOps = new JSImage( "IJS_PointOps", "bee.jpg" );
    });

</script>
<style type="text/css" media="screen">
    .btn-group .glyphicon { margin-right: 0 }
    .point-ops-demo { font-size: 0.9em }
    .form-control.threshold { width: 4em }
</style>

<canvas class="img-responsive" id="IJS_PointOps">your browser does not support canvas</canvas>

<style>
table td { padding: 11px; font-weight: bold }
</style>

|                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Value (Brightness) <br><button class="btn btn-default" onmousedown="IJS_PointOps.value( IJS_PointOps.canvas, 10 )">+</button> <button class="btn btn-default" onmousedown="IJS_PointOps.value( IJS_PointOps.canvas, -10 )">-</button>      | Contrast <br> <button class="btn btn-default" onmousedown="IJS_PointOps.contrast( IJS_PointOps.canvas, 1.1)" >+</button> <button class="btn btn-default" onmousedown="IJS_PointOps.contrast( IJS_PointOps.canvas, 0.9)" >-</button> |
| Saturation <br> <button class="btn btn-default" onmousedown="IJS_PointOps.saturation( IJS_PointOps.canvas, 25 )" >+</button> <button class="btn btn-default" onmousedown="IJS_PointOps.saturation( IJS_PointOps.canvas, -25 )" >-</button> | Hue <br> <button class="btn btn-default" onmousedown="IJS_PointOps.hue( IJS_PointOps.canvas, 20)" >+</button> <button class="btn btn-default" onmousedown="IJS_PointOps.hue( IJS_PointOps.canvas, -20)" >-</button>                 |
| <button class="btn btn-default" onmousedown="IJS_PointOps.invert()">Invert</button> <button class="btn btn-default" onmousedown="IJS_PointOps.threshold( IJS_PointOps.canvas, document.getElementById('t').value )">Threshold</button>     | <input type="text" value="127" class="form-control threshold" maxlength="3" size="3" id="t" /> <button class="btn btn-default" onclick="IJS_PointOps = new JSImage( 'IJS_PointOps', 'bee.jpg' );">Reset</button>                    |
