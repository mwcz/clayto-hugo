/* global define */
/* jshint browser: true */

(function () {

var deps = [
    'glmatrix',
    'dimo/config',
];

function main(m, config) {

    var G = {};

    var vec2 = m.vec2;

    var r;
    var nv; // normalization divisor
    var xd, yd; // diffs
    var ux, uy; // unit vector x
    var ax, ay; // accel values

    var p1v  = m.vec2.create();
    var p2v  = m.vec2.create();
    var ov   = m.vec2.create(); // out vector
    var mag;

    G.accel = function (p1x, p1y, p2x, p2y, f) {
        vec2.set(p1v, p1x, p1y);
        vec2.set(p2v, p2x, p2y);
        r = Math.pow(vec2.distance(p1v, p2v), 2);
        vec2.subtract(ov, p2v, p1v);
        vec2.normalize(ov, ov);
        mag = f/r;
        vec2.scale(ov, ov, Math.abs(mag) < config.MAX_ACCEL ? mag : 0);
        return ov;
    };

    var xd2, yd2;

    G.accel = function(dest, p1x, p1y, p2x, p2y, f) {
        // I wrote this one by hand thinking it'd be faster than relying on
        // vector library functions with the overhead of many function calls.
        // It's MUCH MUCH faster than threejs vector math, but it's exactly the
        // same speed as glmatrix.  glmatrix is easier to read so we'll go with
        // that...

        xd = p2x - p1x;
        yd = p2y - p1y;

        xd2 = Math.pow( xd, 2 );
        yd2 = Math.pow( yd, 2 );
        r = xd2 + yd2;

        nv = Math.sqrt(r);

        ux = xd / nv;
        uy = yd / nv;

        mag = f / r;

        if (Math.abs(mag) > config.MAX_ACCEL) {
            mag = config.MAX_ACCEL * Math.abs(mag) / mag;
        }

        ax = ux * mag;
        ay = uy * mag;

        dest[0] = ax;
        dest[1] = ay;

    };

    return G;
}

define(deps, main);

})();
