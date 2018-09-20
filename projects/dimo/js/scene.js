/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'three'
];

function main(THREE) {

    return new THREE.Scene();

}

define(deps, main);

})(window);
