/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'dimo/config'
];

function main(config) {
    var obj = {};
    var id;
    var startTime;

    obj.start_timer = function start_timer() {
        startTime = new Date().getTime();
        // slowly increment MAX_ACCEL
        id = setInterval(function () {
            var inc = Math.pow((new Date().getTime() - startTime)/100000, 2);
            config.MAX_ACCEL += inc;
            if (config.MAX_ACCEL > 2) {
                startTime = new Date().getTime();
            }
            config.MAX_ACCEL %= 2;
        }, 100);
    };

    obj.stop_timer = function stop_timer() {
        clearInterval(id);
    };

    return obj;
}

define(deps, main);

})(window);
