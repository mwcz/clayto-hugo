define(["exports", "module", "lodash", "commands/powerup", "conf"], function (exports, module, _lodash, _commandsPowerup, _conf) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var each = _lodash.each;
    var partial = _lodash.partial;
    var set = _lodash.set;
    var delay = _lodash.delay;
    var bind = _lodash.bind;

    var powerup = _interopRequire(_commandsPowerup);

    var conf = _conf;

    var _ = partial.placeholder;

    var shellshock_powerup = (function (_powerup) {
        function shellshock_powerup(players, player) {
            _classCallCheck(this, shellshock_powerup);

            _powerup.call(this, "shellshock_powerup", "hack");
            this.players = players;
            this.player = player;
        }

        _inherits(shellshock_powerup, _powerup);

        shellshock_powerup.prototype.execute = function execute() {
            // curse all players
            each(this.players, partial(set, _, "cursed_move", conf.CURSED_VALUE));
            // uncurse the player who cast shellshock :)
            this.player.cursed_move = conf.UNCURSED_VALUE;
            delay(bind(this.undo, this), conf.CURSED_DURATION);
        };

        shellshock_powerup.prototype.undo = function undo() {
            // uncurse all players
            each(this.players, partial(set, _, "cursed_move", conf.UNCURSED_VALUE));
        };

        return shellshock_powerup;
    })(powerup);

    module.exports = shellshock_powerup;
});