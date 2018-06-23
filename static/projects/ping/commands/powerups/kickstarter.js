define(["exports", "module", "commands/powerup", "conf"], function (exports, module, _commandsPowerup, _conf) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var powerup = _interopRequire(_commandsPowerup);

    var conf = _conf;

    var kickstarter_powerup = (function (_powerup) {
        function kickstarter_powerup(players, player) {
            _classCallCheck(this, kickstarter_powerup);

            _powerup.call(this, "kickstarter_powerup", "kick");
            this.player = player;
        }

        _inherits(kickstarter_powerup, _powerup);

        kickstarter_powerup.prototype.execute = function execute() {
            var scale = arguments[0] === undefined ? 1 : arguments[0];

            this.player.springiness += conf.KICKSTARTER_MULTIPLIER;
        };

        kickstarter_powerup.prototype.undo = function undo() {
            this.player.springiness = conf.PADDLE_SPRINGINESS_DEFAULT;
        };

        return kickstarter_powerup;
    })(powerup);

    module.exports = kickstarter_powerup;
});