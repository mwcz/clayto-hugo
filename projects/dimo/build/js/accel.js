/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'glmatrix',
];

function main(m) {

    var vec2 = m.vec2;

    var p1x;
    var p1y;
    var p2x;
    var p2y;
    var r;
    var nv; // normalization divisor
    var xd, yd; // diffs
    var ux, uy; // unit vector x
    var ax, ay; // accel values
    var g = -9.81*1e3;

    var p1v  = m.vec2.create();
    var p2v  = m.vec2.create();
    var ov   = m.vec2.create(); // out vector
    var mag;

    var MAX_ACCEL = 5;

    var RANDOM_VARIANCE = 0.7;

    function glaccel(p1, p2) {
        vec2.set(p1v, p1[0], p1[1]);
        vec2.set(p2v, p2[0], p2[1]);
        r = Math.pow(vec2.distance(p1v, p2v), 2);
        vec2.subtract(ov, p2v, p1v);
        vec2.normalize(ov, ov);
        mag = Math.max(Math.random(), RANDOM_VARIANCE)*g/r;
        vec2.scale(ov, ov, Math.abs(mag) < MAX_ACCEL ? mag : 0);
        return ov;
    }

    var xd2, yd2;
    function accel(p1, p2) {
        // I wrote this one by hand thinking it'd be faster than relying on
        // vector library functions with the overhead of many function calls.
        // It's MUCH MUCH faster than threejs vector math, but it's exactly the
        // same speed as glmatrix.  glmatrix is easier to read so we'll go with
        // that...

        p1x = p1[0];
        p1y = p1[1];
        p2x = p2[0];
        p2y = p2[1];

        xd = p2x - p1x;
        yd = p2y - p1y;

        xd2 = Math.pow( xd, 2 );
        yd2 = Math.pow( yd, 2 );
        r = xd2 + yd2;

        nv = Math.sqrt(r);

        ux = xd / nv;
        uy = yd / nv;

        ax = mass * g * ux / r;
        ay = mass * g * uy / r;

        return [ax, ay];

    }

    return glaccel;
}

define(deps, main);

})(window);


