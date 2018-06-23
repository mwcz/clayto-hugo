/* global define */
/* jshint browser: true */

(function (global) {

function main() {
    return {
        WIDTH : window.innerWidth,
        HEIGHT : window.innerHeight,
    };
}

define(main);

})(window);
