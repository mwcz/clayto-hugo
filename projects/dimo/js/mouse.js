/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'underscore',
];

function main(_) {

    var coords = {x: 0, y: 0};
    var UPDATE_EVERY = 20; // ms
    var callbacks = [];


    function add_callback(callback) {
        callbacks.push(callback);
    }

    function run_callbacks() {
        _.each(callbacks, function(f) { f(coords); });
    }

    function on_mouse_move(ev) {
        coords.x = ev.clientX / window.innerWidth;
        coords.y = ev.clientY / window.innerHeight;

        run_callbacks();
    }

    function init() {

        // throttle the mouse move listener so it doesn't fire constantly while the mouse is in motion
        // every few hundred ms is enough
        var throttled_listener = _.throttle(on_mouse_move, UPDATE_EVERY);
        document.addEventListener('mousemove', throttled_listener);
    }

    return {
        init         : init,
        coords       : coords,
        add_callback : add_callback,
    };

}

define(deps, main);

})(window);
