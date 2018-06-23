/* global define, console */
/* jshint browser: true */

(function (global) {

var deps = [
    'three',
    'dimo/viewport',
    'dimo/origin',
    'dimo/gravity',
    'dimo/player_colors',
    'dimo/mouse',
    'dimo/config',
    'text!shaders/vertex.vert',
    'text!shaders/player.frag',
    'glmatrix',
];

function main(
    THREE,
    viewport,
    origin,
    grav,
    colors,
    mouse,
    config,
    vert,
    frag
) {

    var U = {};

    var WIDTH  = viewport.WIDTH;
    var HEIGHT = viewport.HEIGHT;

    var i30    = 0;
    var i31    = 1;

    var size;
    var pos;

    var player_names = ['red', 'green', 'blue'];

    // this is the placeholder for velocity input that will come from websocket
    // connection to the dimo server
    var input = {
        red: {x:0,y:0},
        green: {x:0,y:0},
        blue: {x:0,y:0},
    };

    U.count = 2;
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

    var color;

    function set_count(c) {
        U.count = c;
        U.positions    = new Float32Array( U.count * 3 );
        U.prevpos      = new Float32Array( U.count * 3 );
        U.colors       = new Float32Array( U.count * 3 );
        U.sizes        = new Float32Array( U.count );

        for( var v = 0; v < U.count; v++ ) {

            U.sizes[ v ] = U.size;

            U.positions[ v * 3 + 0 ] = 0;// ( Math.random() * accd - accdh ) * WIDTH;
            U.positions[ v * 3 + 1 ] = 0;// ( Math.random() * accd - accdh ) * HEIGHT;
            U.positions[ v * 3 + 2 ] = 10; // z is fixed

            color = colors[ v % colors.length ];

            U.colors[ v * 3 + 0 ] = color.r;
            U.colors[ v * 3 + 1 ] = color.g;
            U.colors[ v * 3 + 2 ] = color.b;

        }
    }

    set_count(U.count);

    U.geometry.addAttribute( 'position'     , new THREE.BufferAttribute( U.positions,  3 ) );
    U.geometry.addAttribute( 'customColor'  , new THREE.BufferAttribute( U.colors, 3 ) );
    U.geometry.addAttribute( 'size'         , new THREE.BufferAttribute( U.sizes,  1 ) );

    size  = U.geometry.attributes.size.array;
    pos   = U.geometry.attributes.position.array;

    U.system = new THREE.PointCloud( U.geometry, particle_material );

    U.system.sortParticles = true;

    var INPUT_RES;
    var INPUT_RES_H;

    var player_being_moved = 0;

    function handle_ws_message(message) {
        input = JSON.parse(message.data);
        if (!INPUT_RES) {
            INPUT_RES = [input.w, input.h];
            INPUT_RES_H = [ INPUT_RES[0] / 2, INPUT_RES[1] / 2];
        }
        input.player_names[0].x = (input.player_names[0].x - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.player_names[0].y = (input.player_names[0].y - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
        input.player_names[1].x = (input.player_names[1].x - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.player_names[1].y = (input.player_names[1].y - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
        input.player_names[2].x = (input.player_names[2].x - INPUT_RES_H[0]) * 1.75 * WIDTH  / INPUT_RES[0];
        input.player_names[2].y = (input.player_names[2].y - INPUT_RES_H[1]) * 1.75 * HEIGHT / INPUT_RES[1];
    }

    function handle_mouse_update(coords) {
        if (player_being_moved < player_names.length) {
            input[player_names[player_being_moved]].x = (-coords.x * WIDTH * 1.0 + WIDTH/2) * 1.6;
            input[player_names[player_being_moved]].y = (coords.y * HEIGHT * 1.0 - HEIGHT/2) * 1.6;
        }
    }

    function init_mouse_input() {
        mouse.init();
        mouse.add_callback(handle_mouse_update);
    }

    function init_websockets_input() {
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
            console.log("Failed to create websocket connection to dimo server.");
            console.error(e);
        }
    }

    U.activate_next_player = function() {
        player_being_moved += 1;
        player_being_moved %= U.count + 1;
    };

    function init_input() {
        switch (config.INPUT_TYPE) {
            case 'mouse':
                init_mouse_input();
            break;

            case 'websockets':
                init_websockets_input();
            break;

            default:
                // code ...
        }
    }
    init_input();

    var i;

    U.smoothing         = 0.5;
    var LAST_POS_WEIGHT = U.smoothing;
    var CUR_POS_WEIGHT  = 1 - U.smoothing;

    U.update = function () {

        for( i = U.count - 1; i >= 0; i-- ) {

            i30 = i * 3;
            i31 = i30+ 1;

            // update position with data from input server, after applying input smoothing
            pos[i30] = (CUR_POS_WEIGHT * U.FLIP_X * input[player_names[i]].x) + LAST_POS_WEIGHT * U.prevpos[i30];
            pos[i31] = (CUR_POS_WEIGHT * U.FLIP_Y * input[player_names[i]].y) + LAST_POS_WEIGHT * U.prevpos[i31];

            // store position as previous position
            U.prevpos[i30] = pos[i30];
            U.prevpos[i31] = pos[i31];

        }

        U.geometry.attributes.position.needsUpdate = true;
    };

    U.set_count = set_count;

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
