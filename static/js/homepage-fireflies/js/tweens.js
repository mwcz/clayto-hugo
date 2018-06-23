"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tween = function () {
    function Tween() {
        _classCallCheck(this, Tween);
    }

    _createClass(Tween, null, [{
        key: "linearTween",
        value: function linearTween(t, b, c, d) {
            return c * t / d + b;
        }

        // quadratic easing in - accelerating from zero velocity

    }, {
        key: "easeInQuad",
        value: function easeInQuad(t, b, c, d) {
            t /= d;
            return c * t * t + b;
        }

        // quadratic easing out - decelerating to zero velocity

    }, {
        key: "easeOutQuad",
        value: function easeOutQuad(t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }

        // quadratic easing in/out - acceleration until halfway, then deceleration

    }, {
        key: "easeInOutQuad",
        value: function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        // cubic easing in - accelerating from zero velocity

    }, {
        key: "easeInCubic",
        value: function easeInCubic(t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        }

        // cubic easing out - decelerating to zero velocity

    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        }

        // cubic easing in/out - acceleration until halfway, then deceleration

    }, {
        key: "easeInOutCubic",
        value: function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        // quartic easing in - accelerating from zero velocity

    }, {
        key: "easeInQuart",
        value: function easeInQuart(t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        }

        // quartic easing out - decelerating to zero velocity

    }, {
        key: "easeOutQuart",
        value: function easeOutQuart(t, b, c, d) {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        }

        // quartic easing in/out - acceleration until halfway, then deceleration

    }, {
        key: "easeInOutQuart",
        value: function easeInOutQuart(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        }

        // quintic easing in - accelerating from zero velocity

    }, {
        key: "easeInQuint",
        value: function easeInQuint(t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        }

        // quintic easing out - decelerating to zero velocity

    }, {
        key: "easeOutQuint",
        value: function easeOutQuint(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        }

        // quintic easing in/out - acceleration until halfway, then deceleration

    }, {
        key: "easeInOutQuint",
        value: function easeInOutQuint(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        }

        // sinusoidal easing in - accelerating from zero velocity

    }, {
        key: "easeInSine",
        value: function easeInSine(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        }

        // sinusoidal easing out - decelerating to zero velocity

    }, {
        key: "easeOutSine",
        value: function easeOutSine(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        }

        // sinusoidal easing in/out - accelerating until halfway, then decelerating

    }, {
        key: "easeInOutSine",
        value: function easeInOutSine(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }

        // exponential easing in - accelerating from zero velocity

    }, {
        key: "easeInExpo",
        value: function easeInExpo(t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }

        // exponential easing out - decelerating to zero velocity

    }, {
        key: "easeOutExpo",
        value: function easeOutExpo(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }

        // exponential easing in/out - accelerating until halfway, then decelerating

    }, {
        key: "easeInOutExpo",
        value: function easeInOutExpo(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        }

        // circular easing in - accelerating from zero velocity

    }, {
        key: "easeInCirc",
        value: function easeInCirc(t, b, c, d) {
            t /= d;
            return -c * (sqrt(1 - t * t) - 1) + b;
        }

        // circular easing out - decelerating to zero velocity

    }, {
        key: "easeOutCirc",
        value: function easeOutCirc(t, b, c, d) {
            t /= d;
            t--;
            return c * sqrt(1 - t * t) + b;
        }

        // circular easing in/out - acceleration until halfway, then deceleration

    }, {
        key: "easeInOutCirc",
        value: function easeInOutCirc(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return -c / 2 * (sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (sqrt(1 - t * t) + 1) + b;
        }
    }]);

    return Tween;
}();