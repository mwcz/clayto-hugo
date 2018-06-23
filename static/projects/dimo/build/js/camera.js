/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'three',
    'dimo/particles',
];

function main(THREE, particles) {

    var camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 9001 );

    camera.position.z = 1750;

    return camera;

}

define(deps, main);

})(window);
