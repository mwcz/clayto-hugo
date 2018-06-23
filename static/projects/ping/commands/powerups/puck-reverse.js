define(["exports", "module", "Phaser", "commands/powerup", "conf", "puck-history"], function (exports, module, _Phaser, _commandsPowerup, _conf, _puckHistory) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Phaser = _interopRequire(_Phaser);

    var powerup = _interopRequire(_commandsPowerup);

    var conf = _conf;
    var puck_history = _puckHistory;

    var puck_reverse_powerup = (function (_powerup) {
        function puck_reverse_powerup(players, player) {
            _classCallCheck(this, puck_reverse_powerup);

            _powerup.call(this, "puck_reverse_powerup", "flip");
            this.players = players;
            this.player = player;
        }

        _inherits(puck_reverse_powerup, _powerup);

        puck_reverse_powerup.prototype.execute = function execute(puck) {
            // reverse the velocity of the puck
            Phaser.Point.negative(this.player.puck.body.velocity, this.player.puck.body.velocity);

            // if a goal is scored 'by' the flip, the player who activated the flip
            // should get credit!
            puck_history.push(this.player.name);
        };

        puck_reverse_powerup.prototype.undo = function undo() {};

        return puck_reverse_powerup;
    })(powerup);

    module.exports = puck_reverse_powerup;
});

// undo is a noop here