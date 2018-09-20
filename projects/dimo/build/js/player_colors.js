/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'three',
];

function main(THREE) {
    return [
        new THREE.Color().setRGB( 1, 0, 0 ),   // this should be red!
        new THREE.Color().setRGB( 0, 1, 0 ), // this should be green!
        new THREE.Color().setRGB( 0.0, 0.5, 1 ) // this should be blue!
    ];
}

define(deps, main);

})(window);
