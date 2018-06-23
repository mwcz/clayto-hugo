"use strict";

var OP_CONF = 0;
var OP_COLOR = 1;
var LED_COUNT = 1;

function mockConfMsg() {
    var conf_msg = new ArrayBuffer(2 + 6 * LED_COUNT); // 1 for opcode

    // set opcode for conf
    var conf_view = new Uint16Array(conf_msg);
    conf_view[0] = OP_CONF;

    // set xyz for conf
    conf_view[1] = 1;
    conf_view[2] = 1;
    conf_view[3] = 12;

    return conf_msg;
}

function mockColorMsg() {
    var color_msg = new ArrayBuffer(2 + 3 * LED_COUNT); // 1 for opcode

    // set opcode for color
    var color_view = new DataView(color_msg);
    color_view.setUint16(0, OP_COLOR);

    // set rgb for color
    color_view.setUint8(2, 64);
    color_view.setUint8(3, 214);
    color_view.setUint8(4, 127);

    return color_msg;
}