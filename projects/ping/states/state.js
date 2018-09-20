define(["exports", "module"], function (exports, module) {
    "use strict";

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var state = (function () {
        function state(name) {
            _classCallCheck(this, state);

            this.name = name;
        }

        state.prototype.init = function init() {
            console.log("STATE: activated '" + this.name + "'");
        };

        return state;
    })();

    module.exports = state;
});