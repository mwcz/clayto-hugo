/* global requestAnimationFrame, define */
/* jslint browser: true */

(function (global) {

var deps = [
    'three',
    'stats',
    'underscore',
    'dimo/camera',
    'dimo/scene',
    'dimo/particles',
    'dimo/players',
    'dimo/viewport',
    'dimo/config-panel',
    'dimo/config',
    'dimo/timer',
];

function main(
    THREE,
    Stats,
    _,
    camera,
    scene,
    particles,
    players,
    viewport,
    panel,
    conf,
    timer
) {

    var WIDTH  = viewport.WIDTH;
    var HEIGHT = viewport.HEIGHT;

    var stats;

    var renderer;

    var fps = 60;
    var now;
    var then = Date.now();
    var interval = 1000 / fps;
    var delta;


    init();
    setTimeout(animate(), 0);

    function set_fps(new_fps) {
        fps = new_fps;
        interval = 1000 / fps;
        return fps;
    }

    function init() {

        scene.add( particles.system );
        scene.add( players.system );

        //

        renderer = new THREE.WebGLRenderer({
            precision: "lowp",
        });
        renderer.setClearColor( 0x000000, 1 );
        renderer.setSize( WIDTH, HEIGHT );

        document.body.appendChild( renderer.domElement );

        //

        if (conf.DISPLAY_STATS) {
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            document.body.appendChild( stats.domElement );
        }

        //

        timer.start_timer();

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize( WIDTH, HEIGHT );

    }

    //

    function animate() {

        requestAnimationFrame( animate );

        // now = Date.now();
        // delta = now - then;
        render();

        // if (delta > interval) {
        //     then = now - (delta % interval);
        //     render();
        //     if (conf.DISPLAY_STATS) {
        //         stats.update();
        //     }
        // }

    }

    function render() {

        particles.update();
        players.update();

        renderer.render( scene, camera );
    }
}

define(deps, main);

}(window));

