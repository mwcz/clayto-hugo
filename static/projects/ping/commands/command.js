define(["exports", "module", "log"], function (exports, module, _log) {
    "use strict";

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var log = _log;

    var command = (function () {
        function command() {
            var name = arguments[0] === undefined ? "" : arguments[0];

            _classCallCheck(this, command);

            this.name = name + "_command";
        }

        command.prototype.execute = function execute() {
            log.noimpl_method(this.name, "execute");
        };

        command.prototype.undo = function undo() {
            log.noimpl_method(this.name, "undo");
        };

        return command;
    })();

    module.exports = command;
});