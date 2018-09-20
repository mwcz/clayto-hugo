define(["exports"], function (exports) {
    "use strict";

    exports.__esModule = true;
    function noimpl_method(name, fn) {
        console.warn("Attempted to invoke " + name + ".prototype." + fn + ", but it is not implemented.");
    }

    exports.noimpl_method = noimpl_method;
});