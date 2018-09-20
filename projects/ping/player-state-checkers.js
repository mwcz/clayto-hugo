define(["exports", "conf"], function (exports, _conf) {
  "use strict";

  exports.__esModule = true;
  /**
   * Player state predicates.
   */

  var conf = _conf;
  var inactive = function (p) {
    return p.state === conf.PLAYER_STATE.INACTIVE;
  };
  exports.inactive = inactive;
  var playing = function (p) {
    return p.state === conf.PLAYER_STATE.PLAYING;
  };
  exports.playing = playing;
  var choosing_letter = function (p) {
    return p.state === conf.PLAYER_STATE.LOGIN_CHOOSING_LETTER;
  };
  exports.choosing_letter = choosing_letter;
  var choosing_name = function (p) {
    return p.state === conf.PLAYER_STATE.LOGIN_CHOOSING_PLAYER;
  };
  exports.choosing_name = choosing_name;
  var logging_in = function (p) {
    return choosing_letter(p) || choosing_name(p);
  };
  exports.logging_in = logging_in;
});