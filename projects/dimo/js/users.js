/* global define, console */
/* jshint browser: true */

(function (global) {

var deps = [
    'three',
    'dimo/viewport',
    'dimo/origin',
    'dimo/gravity',
    'dimo/colors',
    'text!shaders/vertex.vert',
    'text!shaders/user.frag',
    'glmatrix',
];

function main(
    THREE,
    viewport,
    origin,
    grav,
    colors,
    vert,
    frag
) {

    var U = {};

    var WIDTH  = viewport.WIDTH;
    var HEIGHT = viewport.HEIGHT;

    var i30    = 0;
    var i31    = 1;

    var size;
    var vel;
    var pos;

    // this is the placeholder for velocity input that will come from websocket
    // connection to the dimo server
    var input = {
        red: {x:0,y:0},
        green: {x:0,y:0},
        blue: {x:0,y:0},
    };

    U.count = 3;
    U.size = 256;
    U.FLIP_X = -1;
    U.FLIP_Y = -1;

    var accd  = 0.50; // how much the acceleration is allowed to change each frame
    var accdh = accd / 2;

    U.geometry = new THREE.BufferGeometry();

    // THREE.NoBlending
    // THREE.NormalBlending
    // THREE.AdditiveBlending
    // THREE.SubtractiveBlending
    // THREE.MultiplyBlending

    var attributes = {
        size         : { type : 'f',  value : null },
        customColor  : { type : 'c',  value : null },
        acceleration : { type : 'v3', value : null },
    };

    var uniforms = {
        color:     { type: "c", value: new THREE.Color( 0xffffff ) },
        texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "img/particle-wide-glow-big.png" ) }
    };

    var particle_material = new THREE.ShaderMaterial( {

        uniforms       : uniforms,
        attributes     : attributes,
        vertexShader   : vert,
        fragmentShader : frag,
        blending       : THREE.AdditiveBlending,
        depthTest      : false,
        transparent    : true

    } );

    U.positions    = new Float32Array( U.count * 3 );
    U.prevpos      = new Float32Array( U.count * 3 );
    U.colors       = new Float32Array( U.count * 3 );
    U.sizes        = new Float32Array( U.count );
    var color;

    for( var v = 0; v < U.count; v++ ) {

        U.sizes[ v ] = U.size;

        U.positions[ v * 3 + 0 ] = ( Math.random() * accd - accdh ) * WIDTH;
        U.positions[ v * 3 + 1 ] = ( Math.random() * accd - accdh ) * HEIGHT;
        U.positions[ v * 3 + 2 ] = 10; // z is fixed

        color = colors[ v % colors.length ];

        U.colors[ v * 3 + 0 ] = color.r;
        U.colors[ v * 3 + 1 ] = color.g;
        U.colors[ v * 3 + 2 ] = color.b;

    }

    U.geometry.addAttribute( 'position'     , new THREE.BufferAttribute( U.positions,  3 ) );
    U.geometry.addAttribute( 'customColor'  , new THREE.BufferAttribute( U.colors, 3 ) );
    U.geometry.addAttribute( 'size'         , new THREE.BufferAttribute( U.sizes,  1 ) );

    size  = U.geometry.attributes.size.array;
    pos   = U.geometry.attributes.position.array;

    U.system = new THREE.PointCloud( U.geometry, particle_material );

    U.system.sortParticles = true;

    var INPUT_RES;
    var INPUT_RES_H;

    function handle_ws_message(message) {
        input = JSON.parse(message.data);
        if (!INPUT_RES) {
            INPUT_RES = [input.w, input.h];
            INPUT_RES_H = [ INPUT_RES[0] / 2, INPUT_RES[1] / 2];
            console.log("Set INPUT_RES: " + INPUT_RES);
        }
        input.red.x   = (input.red.x   - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.red.y   = (input.red.y   - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
        input.green.x = (input.green.x - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.green.y = (input.green.y - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
        input.blue.x  = (input.blue.x  - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.blue.y  = (input.blue.y  - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
    }

    try {
        // var ip = '10.192.212.90';
        var ip = '127.0.0.1';
        var connection = new WebSocket('ws://' + ip + ':1337');
        connection.onopen = function () {
            console.log("connection established");
            // when connection opens, establish message handler
            connection.onmessage = handle_ws_message;
        };
    } catch (e) {
        console.error("Failed to create websocket connection to dimo server.");
        console.error(e);
    }

    var i;
    var colornames = ['red', 'green', 'blue'];

    U.smoothing         = 0.5;
    var LAST_POS_WEIGHT = U.smoothing;
    var CUR_POS_WEIGHT  = 1 - U.smoothing;

    U.update = function () {

        for( i = U.count - 1; i >= 0; i-- ) {

            i30 = i * 3;
            i31 = i30+ 1;

            // update position with data from input server, after applying input smoothing
            pos[i30] = (CUR_POS_WEIGHT * U.FLIP_X * input[colornames[i]].x) + LAST_POS_WEIGHT * U.prevpos[i30];
            pos[i31] = (CUR_POS_WEIGHT * U.FLIP_Y * input[colornames[i]].y) + LAST_POS_WEIGHT * U.prevpos[i31];

            // store position as previous position
            U.prevpos[i30] = pos[i30];
            U.prevpos[i31] = pos[i31];

        }

        U.geometry.attributes.position.needsUpdate = true;
    };

    U.set_size = function(s) {
        var i;
        for (i = U.sizes.length - 1; i >= 0; i -= 1){
            U.sizes[i] = s;
        }
        U.geometry.attributes.size.needsUpdate = true;
    };

    U.set_smoothing = function(s) {
        LAST_POS_WEIGHT = s;
        CUR_POS_WEIGHT  = 1 - s;
    };

    return U;
}

define(deps, main);

})(window);
