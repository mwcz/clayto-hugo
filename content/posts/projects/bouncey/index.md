---
Title: "Bouncey"
Date: 2011-11-17
url: /projects/bouncey
thumbnail: ./icon_bouncey.jpg
Categories: Projects
description: "A fun, simple, and oddly relaxing hacky simulation of bouncing circles."
Tags:
 -  html5
 -  javascript
---

Bouncey is a simple physics demo I wrote in early/mid 2011, with
some contributions and bugfixes from my good friend Greg Gardner.

Fun, simple, and oddly relaxing.

---

<style type="text/css">
#cnvs {
    background-color: #1f1f1f;
    margin: 0 auto;
    -webkit-box-shadow: 0px 2px 18px rgba( 0, 0, 0, 0.7 );
       -moz-box-shadow: 0px 2px 18px rgba( 0, 0, 0, 0.7 );
         -o-box-shadow: 0px 2px 18px rgba( 0, 0, 0, 0.7 );
            box-shadow: 0px 2px 18px rgba( 0, 0, 0, 0.7 );
}
</style>
<script type="text/javascript" src="bouncey.js"></script>
<script type="text/javascript">

$(function() {

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

    setInterval( make_frame, PERIOD );

});

</script>

<canvas class="img-responsive" id="cnvs" width="500" height="375">
    Sorry, your browser does not support HTML5 canvas.  Lame.
</canvas>

---

[Posts about Bouncey][1]

[Bouncey's code on GitHub][2]

[1]: /tag/bouncey/ "Posts about Bouncey"
[2]: https://github.com/mwcz/bouncey/ "Bouncey on GitHub"
