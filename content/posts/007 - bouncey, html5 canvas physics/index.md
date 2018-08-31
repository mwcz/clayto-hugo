---
Title: "Bouncey - canvas physics"
Date: 2011-11-17
Tags:
 -  html5
 -  canvas
 -  physics
 -  javascript
 -  bouncey
 -  web
thumbnail: thumb.jpg
aliases: /2011/11/17/bouncey-canvas-physics/
Mwc: 7
---

This is Bouncey. It's a simple physics demo I wrote in early/mid 2011, with some contributions and bugfixes from my good friend Greg Gardner.

The description for [bouncey's github repo](https://github.com/mwcz/bouncey) is:

<quote>"a buggy, rudimentary, just-for-fun javascript physics simulator."</quote>

It covers [Newton's laws of motion](http://en.wikipedia.org/wiki/Newton's_laws_of_motion).

<style type="text/css">
#cnvs {
    margin: 0 auto;
    display: block;
    border: 1px solid black;
    -webkit-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
       -moz-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
         -o-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
            box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
}
</style>

<script type="text/javascript" src="bouncey.js"></script>

<script type="text/javascript">

window.onload = function() {

    canvas_element        = document.getElementById('cnvs');
    canvas_element.width  = W;
    canvas_element.height = H;

    canvas = canvas_element.getContext('2d');

    // create some squares with random velocities in the center of the canvas
    // objects are stored in the format
    //      [ X, Y, X_velocity, Y_velocity, width, height, [R,G,B] ]
    var x, y, w, h, v_x, v_y, r, g, b, new_obj;

    // calculate all the possible initial y positions
    y_positions = [];
    for( var i = OBJ_HEIGHT; i < H - OBJ_HEIGHT; i += 2 * OBJ_HEIGHT )
        y_positions.push( i );

    // calculate all the possible initial x positions
    x_positions = [];
    for( var i = OBJ_WIDTH; i < W - OBJ_WIDTH; i += 2 * OBJ_WIDTH )
        x_positions.push( i );

    /*
    */
    for( var i = 0; i < 40; ++i ) {

        // create values for the object
        x   = x_positions[ i % x_positions.length ];
        y   = y_positions[ Math.floor( i / x_positions.length ) % y_positions.length ];
        v_x = Math.random() * OBJ_MAX_VELOCITY*2 - OBJ_MAX_VELOCITY;
        v_y = Math.random() * OBJ_MAX_VELOCITY*2 - OBJ_MAX_VELOCITY;
        r   = Math.floor( Math.random() * 200 + 55 ); // random value 55..255
        g   = Math.floor( Math.random() * 200 + 55 );
        b   = Math.floor( Math.random() * 200 + 55 );

        // add the object to the scene
        var color = 'rgb(' + r + ',' + g + ',' + b + ')';
        var new_obj = new Circle( x, y, OBJ_R, v_x, v_y, color );

        objs.push( new_obj );
    }

    make_frame();

}

</script>

<canvas id="cnvs" width="500" height="375">
    Sorry, your browser does not support HTML5 canvas.  Lame.
</canvas>

<button onclick="paused++;paused%=2;">Pause</button>

An updated (but less colorful) version of bouncey is available
[here]({filename}/posts/008 - bouncey returns/008 - bouncey returns.md).
