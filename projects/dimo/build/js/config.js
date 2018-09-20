/* global define */
/* jshint browser: true */

(function (global) {

var deps = [];

function main() {
    var config = {
        MAX_ACCEL               : 1,
        RANDOM_GRAVITY_VARIANCE : 0.2,
        G                       : -1e4,
        DISPLAY_STATS           : true,
        CONFIG_PANEL_VISIBLE    : true,
        INPUT_TYPE              : ['websockets', 'mouse'][1],
        CYCLE_ACCELERATION      : true,
    };

    config.set_value = function (name, value) {
        config[name] = value;
    };

    return config;
}

define(deps, main);

})(window);
