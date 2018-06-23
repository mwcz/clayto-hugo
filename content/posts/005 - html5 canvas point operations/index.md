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
Mwc: 5
---

This is the last demo I made using [JSImage](https://github.com/mwcz/jsimage).  I created it some time around 2009-2010.  At the time, I had checked out an [imaging book](http://www.amazon.com/Digital-Image-Processing-Algorithmic-Introduction/dp/1846283795) from my university's library at least ten times.  Most of the exercises in that book I implemented in Python using [PIL](http://www.pythonware.com/products/pil/), but point operations were simple enough to port to JavaScript quickly.

Point operations are image alterations that affect all pixels equally.  Other operations, like blurring for example, each result pixel depends on adjacent pixels.

This demonstrates changing contrast, value, saturation, hue, color inversion, and threshold point operations.  Note that there is a bug with increasing value and increasing saturation which I never got around to fixing.

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

<div class="point-ops-demo beside">
    <div class="col-xs-6">
        Value (Brightness)
        <br />
        <div class="btn-group">
            <button class="btn btn-default" onmousedown="IJS_PointOps.value( IJS_PointOps.canvas, 10 )">+</button>
            <button class="btn btn-default" onmousedown="IJS_PointOps.value( IJS_PointOps.canvas, -10 )">-</button>
        </div>
    </div>
    <div class="col-xs-6">
        Contrast
        <br />
        <div class="btn-group">
            <button class="btn btn-default" onmousedown="IJS_PointOps.contrast( IJS_PointOps.canvas, 1.1)" >+</button>
            <button class="btn btn-default" onmousedown="IJS_PointOps.contrast( IJS_PointOps.canvas, 0.9)" >-</button>
        </div>
    </div>
    <div class="col-xs-6">
        Saturation
        <br />
        <div class="btn-group">
            <button class="btn btn-default" onmousedown="IJS_PointOps.saturation( IJS_PointOps.canvas, 25 )" >+</button>
            <button class="btn btn-default" onmousedown="IJS_PointOps.saturation( IJS_PointOps.canvas, -25 )" >-</button>
        </div>
    </div>
    <div class="col-xs-6">
        Hue
        <br />
        <div class="btn-group">
            <button class="btn btn-default" onmousedown="IJS_PointOps.hue( IJS_PointOps.canvas, 20)" >+</button>
            <button class="btn btn-default" onmousedown="IJS_PointOps.hue( IJS_PointOps.canvas, -20)" >-</button>
        </div>
    </div>
    <div class="col-xs-6">
        <br />
        <div class="btn-group">
            <button class="btn btn-default" onmousedown="IJS_PointOps.invert()">Invert</button>
        </div>
    </div>
    <div class="col-xs-6">
        <br />
        <div class="input-group">
            <span class="input-group-btn">
                <button class="btn btn-default" onmousedown="IJS_PointOps.threshold( IJS_PointOps.canvas, document.getElementById('t').value )">Threshold</button>
            </span>
            <input type="text" value="127" class="form-control threshold" maxlength="3" size="3" id="t" />
        </div>
    </div>
    <div class="col-xs-6">
        <br />
        <button class="btn btn-default" onclick="IJS_PointOps = new JSImage( 'IJS_PointOps', 'bee.jpg' );">Reset</button>
    </div>
</div>

<br />
