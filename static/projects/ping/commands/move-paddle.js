define(["exports", "commands/command", "conf"], function (exports, _commandsCommand, _conf) {
    "use strict";

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    exports.__esModule = true;
    var command = _commandsCommand;
    var conf = _conf;

    var move_paddle_command = (function (_command) {
        function move_paddle_command() {
            var axis = arguments[0] === undefined ? "x" : arguments[0];
            var speed = arguments[1] === undefined ? 1 : arguments[1];

            _classCallCheck(this, move_paddle_command);

            _command.call(this, "move_paddle");
            this.axis = axis;
            this.speed = speed;
        }

        _inherits(move_paddle_command, _command);

        move_paddle_command.prototype.execute = function execute(pl, paddle) {
            var factor = arguments[2] === undefined ? 1 : arguments[2];

            paddle.body.velocity[this.axis] += this.speed * pl.cursed_move * factor;
        };

        return move_paddle_command;
    })(command);

    var up = new move_paddle_command("y", -conf.PADDLE_VELOCITY_FROM_KEYPRESS);
    var down = new move_paddle_command("y", conf.PADDLE_VELOCITY_FROM_KEYPRESS);
    var left = new move_paddle_command("x", -conf.PADDLE_VELOCITY_FROM_KEYPRESS);
    var right = new move_paddle_command("x", conf.PADDLE_VELOCITY_FROM_KEYPRESS);

    exports.up = up;
    exports.down = down;
    exports.left = left;
    exports.right = right;
});