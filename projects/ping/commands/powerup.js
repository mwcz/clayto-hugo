define(["exports", "module", "commands/command"], function (exports, module, _commandsCommand) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var command = _interopRequire(_commandsCommand);

    var powerup = (function (_command) {
        function powerup() {
            var name = arguments[0] === undefined ? "powerup" : arguments[0];
            var shortname = arguments[1] === undefined ? "pwr" : arguments[1];

            _classCallCheck(this, powerup);

            _command.call(this, name);
            this.shortname = shortname;
        }

        _inherits(powerup, _command);

        powerup.prototype.execute = function execute() {
            var scale = arguments[0] === undefined ? 1 : arguments[0];
        };

        return powerup;
    })(command);

    module.exports = powerup;
});