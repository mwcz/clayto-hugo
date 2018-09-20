/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'three',
    'underscore',
];

function main(THREE, _) {
    var C = {};
    
    C.length = 0;

    C.set_color = function(i, c) {
        var prop = 'color' + i;
        C[prop] = new THREE.Color().setRGB( c.r, c.g, c.b);
        C.length = Math.max(i + 1, C.length);
    };

    C.set_color0 = _.partial(C.set_color, 0);
    C.set_color1 = _.partial(C.set_color, 1);
    C.set_color2 = _.partial(C.set_color, 2);

    C.set_color(0, new THREE.Color().setRGB( 1, 0, 0 ) );
    C.set_color(1, new THREE.Color().setRGB( 0, 1, 0 ) );
    C.set_color(2, new THREE.Color().setRGB( 0.0, 0.5, 1 ) );

    return C;
}

define(deps, main);

})(window);
