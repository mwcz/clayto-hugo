define(["exports", "module", "Phaser", "lodash"], function (exports, module, _Phaser, _lodash) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var Phaser = _interopRequire(_Phaser);

    var each = _lodash.each;
    var identity = _lodash.identity;

    var gamepads = {};
    var cursors = undefined;
    var kb = {};
    var buttons_pressed = {
        pad1: { a: false, b: false, start: false },
        pad2: { a: false, b: false, start: false },
        pad3: { a: false, b: false, start: false },
        pad4: { a: false, b: false, start: false } };

    function init(game) {
        cursors = game.input.keyboard.createCursorKeys();

        kb.z = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        kb.x = game.input.keyboard.addKey(Phaser.Keyboard.X);
        kb.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.Z, Phaser.Keyboard.X, Phaser.Keyboard.SPACEBAR]);

        if (!game.input.gamepad.active) {
            game.input.gamepad.start();
            gamepads.pad1 = game.input.gamepad.pad1;
            gamepads.pad2 = game.input.gamepad.pad2;
            gamepads.pad3 = game.input.gamepad.pad3;
            gamepads.pad4 = game.input.gamepad.pad4;

            each(gamepads, set_connect_callback);
        }
    }

    function set_connect_callback(gamepad) {
        gamepad.onConnectCallback = connect_callback;
    }

    function connect_callback() {
        console.log("INPUT: gamepad connected, index " + this.index);
    }

    function connected(pad) {
        return gamepads[pad].connected;
    }

    function left(pad) {
        return gamepads[pad].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0;
    }
    function right(pad) {
        return gamepads[pad].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0;
    }
    function up(pad) {
        return gamepads[pad].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0;
    }
    function down(pad) {
        return gamepads[pad].axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0;
    }

    function left_once(pad) {
        return pressed_once(pad, null, "left", left);
    }
    function right_once(pad) {
        return pressed_once(pad, null, "right", right);
    }
    function up_once(pad) {
        return pressed_once(pad, null, "up", up);
    }
    function down_once(pad) {
        return pressed_once(pad, null, "down", down);
    }

    function left_kb() {
        return cursors.left.isDown;
    }
    function right_kb() {
        return cursors.right.isDown;
    }
    function down_kb() {
        return cursors.down.isDown;
    }
    function up_kb() {
        return cursors.up.isDown;
    }

    function z_kb_once() {
        return kb.z.isDown && kb.z.repeats === 0;
    }
    function x_kb_once() {
        return kb.x.isDown && kb.x.repeats === 0;
    }

    function pressed_once(pad, button_code, button_name, predicate) {

        // was this button already down, last frame?
        var already_pressed = buttons_pressed[pad][button_name];

        // is the button held down this frame?
        var currently_pressed = undefined;

        if (predicate) {
            currently_pressed = predicate(pad);
        } else {
            currently_pressed = gamepads[pad].isDown(Phaser.Gamepad[button_code]);
        }

        // update the button state so next frame we know whether the button was
        // pressed this frame
        buttons_pressed[pad][button_name] = currently_pressed;

        return currently_pressed && !already_pressed;
    }

    function start_pressed(pad) {
        return pressed_once(pad, "BUTTON_9", "start");
    }
    function a(pad) {
        return pressed_once(pad, "BUTTON_1", "a");
    }
    function b(pad) {
        return pressed_once(pad, "BUTTON_0", "b");
    }

    module.exports = {
        init: init,
        gamepads: gamepads,
        connected: connected,
        left: left,
        right: right,
        up: up,
        down: down,
        left_once: left_once,
        right_once: right_once,
        up_once: up_once,
        down_once: down_once,
        left_kb: left_kb,
        right_kb: right_kb,
        up_kb: up_kb,
        down_kb: down_kb,
        a: a,
        b: b,
        buttons_pressed: buttons_pressed,
        start_pressed: start_pressed,
        z_kb_once: z_kb_once,
        x_kb_once: x_kb_once };
});