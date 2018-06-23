/* global define */
/* jshint browser: true */

(function (global) {

var deps = [];

function main() {
    return {
        "preset": "RGB",
        "closed": false,
        "remembered": {
            "RGB": {
                "0": {},
                "1": {},
                "2": {},
                "3": {},
                "4": {}
            },
            "Fire": {
                "0": {
                    "MAX_ACCEL": 0.06769734090000354,
                    "CYCLE_ACCELERATION": true,
                    "RANDOM_GRAVITY_VARIANCE": 1
                },
                "1": {
                    "smoothing": 0.5,
                    "size": 84.70101671549199
                },
                "2": {},
                "3": {
                    "MAX_VEL": 1.5881440634154746,
                    "MIN_ACCEL_DIST": 0,
                    "size": 19.065138721351026
                },
                "4": {
                    "color0": {
                        "r": 1,
                        "g": 0,
                        "b": 0
                    },
                    "color1": {
                        "r": 1,
                        "g": 0,
                        "b": 0
                    },
                    "color2": {
                        "r": 1,
                        "g": 0.0588235294117645,
                        "b": 0
                    }
                }
            },
            "Stars": {
                "0": {
                    "MAX_ACCEL": 0.18,
                    "CYCLE_ACCELERATION": false,
                    "RANDOM_GRAVITY_VARIANCE": 0.2
                },
                "1": {
                    "smoothing": 0.5,
                    "size": 158.10856453558503
                },
                "2": {},
                "3": {
                    "MAX_VEL": 5.9996553506806825,
                    "MIN_ACCEL_DIST": 44,
                    "size": 5.168878166465621
                },
                "4": {
                    "color0": {
                        "r": 0.9607843137254902,
                        "g": 0.9109166157812606,
                        "b": 0.8665897731641676
                    },
                    "color1": {
                        "r": 0.8823529411764706,
                        "g": 0.8090779564420923,
                        "b": 0.5709342560553632
                    },
                    "color2": {
                        "r": 0.8235294117647058,
                        "g": 0.6691770133659,
                        "b": 0.29873125720876587
                    }
                }
            },
            "Orbits": {
                "0": {
                    "MAX_ACCEL": 0.37,
                    "CYCLE_ACCELERATION": false,
                    "RANDOM_GRAVITY_VARIANCE": 0.2
                },
                "1": {
                    "smoothing": 0.5,
                    "size": 256
                },
                "2": {},
                "3": {
                    "MAX_VEL": 6.352576253661899,
                    "MIN_ACCEL_DIST": 0,
                    "size": 11.422195416164053
                },
                "4": {
                    "color0": {
                        "r": 1,
                        "g": 0,
                        "b": 0
                    },
                    "color1": {
                        "r": 0,
                        "g": 1,
                        "b": 0
                    },
                    "color2": {
                        "r": 0,
                        "g": 0.5,
                        "b": 1
                    }
                }
            }
        },
        "folders": {
            "Gravity": {
                "preset": "Default",
                "closed": false,
                "folders": {}
            },
            "Players": {
                "preset": "Default",
                "closed": false,
                "folders": {}
            },
            "Particles": {
                "preset": "Default",
                "closed": false,
                "folders": {}
            },
            "Info": {
                "preset": "Default",
                "closed": false,
                "folders": {}
            }
        }
    }
}

define(deps, main);

})(window);
