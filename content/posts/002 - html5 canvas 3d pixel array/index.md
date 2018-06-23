---
Title: "HTML5 canvas 3D pixel array"
Date: 2011-11-16
Tags:
 -  html5
 -  canvas
 -  color
 -  colorpal
 -  web
Mwc: 2
---

This is another demo from 2009-ish.  When I started experimenting with canvas, I felt uncomfortable with the 1-dimensionality of [CanvasPixelArray](https://developer.mozilla.org/en/DOM/CanvasPixelArray).  I wrote this script to convert it into a more logical format: X by Y by RGBA.  Let me rephrase that.  By "more logical", I mean "more logical, *to me*, *at the time*).  1D is fine, and I can't think of any use for this script.  But, nonetheless, here it is, including the original description.

<img style="display: none !important;" src="kazoo.png">

<script type="text/javascript">

$(function() {
    var c;
    var cnvs;

    function draw() {

        cnvs = document.getElementById("c");
        tmpl = document.getElementById("t");

        if( cnvs.getContext) { // Check for canvas support

            c = cnvs.getContext('2d');
            t = tmpl.getContext('2d');
            var color = document.getElementById("color");

            var images = new Image();

            images.onload = function() {
                cnvs.width = images.width;
                cnvs.height = images.height; // resize to fit image
                tmpl.width = images.width;
                tmpl.height = images.height; // resize to fit image
                c.drawImage( images, 0, 0 );
            }
            images.src = "kazoo.png";

            getpixelarray = function() {
                var pixarray = new Array();
                var imagesdata = c.getImageData( 0, 0, cnvs.width, cnvs.height ).data;

                /**
                 * getImageData() returns a one-dimensional array where each element represents,
                 * one subpixel.  So a full set of pixels looks like this:
                 *
                 *      (R, G, B, A, R, G, B, A, R, G, B, A, ...)
                 *
                 * Ugly, right?  Yeah.  So I'm translating them into a 2D array where the origin
                 * (sadly) is at the top left.
                 *
                 * When doing the translation, I'm also starting at the bottom right, so there
                 * only has to be ONE array enlarge operation each for the X and Y arrays.
                 */

                // build empty pix array.  we'll fill it later
                //console.time("build empty array");
                for( var x = cnvs.width-1; x >= 0; x-- ) {

                    pixarray[x] = new Array(); // insert new vertical array

                    for( var y = cnvs.height-1; y >= 0; y-- ) {

                        pixarray[x][y] = new Array(0,0,0,0);

                    }

                }


                /**
                 * Now we fill up the pix array with real values.
                 * We don't REALLY need the alpha channel, but I'm including it
                 * just in case a use arises for it in the future.  Likely.
                 */

                for( var i = 0; i < imagesdata.length-3; i+=4 ) {
                    var x = parseInt( parseInt(i/4) % ( cnvs.width ) );
                    var y = parseInt( parseInt(i/4) / ( cnvs.width ) );

                    pixarray[x][y][0] = imagesdata[i];
                    pixarray[x][y][1] = imagesdata[i+1];
                    pixarray[x][y][2] = imagesdata[i+2];
                    pixarray[x][y][3] = imagesdata[i+3];

                }


                for( var y = 0; y < cnvs.height; y++ ) { // loop over y
                    for( var x = 0; x < cnvs.width; x++ ) { // loop over x
                        t.fillStyle = "rgba(" + pixarray[x][y][0] + "," + pixarray[x][y][1] + "," + pixarray[x][y][2] + "," + pixarray[x][y][3] + ")";
                        t.fillRect(x, y, 1, 1);
                    }
                }

                return pixarray;
            }


        }
    }
    draw();

});
</script>


canvas pixarray
===============

After loading an image file into a &lt;canvas&gt; element, you can retrieve its
pixels with `getImageData()`.  The problem (not really a problem, more an
inconvenience) is that the array of pixels is one-dimensional.  `getImageData` returns pixels in the following format:

<pre>
( R<sub>0</sub>, G<sub>0</sub>, B<sub>0</sub>, A<sub>1</sub>, R<sub>1</sub>, G<sub>1</sub>, B<sub>1</sub>, A<sub>1</sub>, ... )
</pre>

As a human, that's really tough to work with, so this script converts that to a more
logical 3D array (X by Y by RGBA)

<input class="btn btn-primary" type="button" value="Convert 1D pixel array into 3D pixel array" onclick="getpixelarray();" />

<div class="row">
    <div class="col-xs-6">
        <div class="panel panel-default">
            <div class="panel-heading">
                <b>
                    Image drawn directly from image file
                </b>
            </div>
            <div class="panel-body">
                <canvas class="img-responsive" id="c" width="650" height="250">
                    Your browser does not support the &lt;canvas&gt; element.
                    Lame.
                </canvas>
            </div>
        </div>
    </div>
    <div class="col-xs-6">
        <div class="panel panel-default">
            <div class="panel-heading">
                <b>
                    Image drawn from the 3D image array
                </b>
            </div>
            <div class="panel-body">
                <canvas class="img-responsive" id="t" width="650" height="250">
                    Your browser does not support the &lt;canvas&gt; element.
                    Lame.
                </canvas>
            </div>
        </div>
    </div>
</div>
