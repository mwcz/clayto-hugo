'use strict';

var config = Object.freeze({

    AUTO_PLAY: !true,

    // canvas resolution
    CANVAS_WIDTH: 200,
    CANVAS_HEIGHT: 600,

    METER_HEIGHT: 100,
    SIM_UPDATE_FREQUENCY: 1 * Phaser.Timer.SECOND,

    // win after surviving this long
    WIN_TIME: 75,

    INITIAL_STATE: {
        alive: true,
        lamp: false,
        generator: false,
        heater: false,
        deathCauses: [],
        food: 8,
        warmth: 10,
        warmthSlope: -1,
        // sanity      : 50,
        // sanitySlope : 0,
        fuelReserve: 6,
        fuelInUse: 15,
        fuelSlope: 0,
        hunger: 0,
        hungerSlope: 1
    },

    // how low or high state values are allowed to go
    BOUNDS: {
        food: [-1, 8],
        warmth: [-1, 10],
        // sanity: [0, Infinity],
        fuelReserve: [-1, 6],
        fuelInUse: [-1, 20],
        hunger: [-Infinity, 100],
        fuelSlope: [-Infinity, Infinity],
        // sanitySlope: [-Infinity, Infinity],
        warmthSlope: [-Infinity, Infinity],
        hungerSlope: [-Infinity, Infinity]
    },

    // the names of the props that can cause death when out of bounds
    DEATH_CAUSES: ['hunger', /*'sanity',*/'warmth'],

    // for each sim state change (like "eat food"), update following values
    STATE_CHANGES: {
        update: {
            hunger: function hunger() {
                return this.state.hungerSlope;
            },
            // sanity      : function() { return this.state.sanitySlope },
            warmth: function warmth() {
                return this.state.warmthSlope;
            },
            fuelInUse: function fuelInUse() {
                return this.state.fuelSlope;
            },
            hungerSlope: 1 // hunger increases exponentially
        },
        eatFood: {
            hunger: -2,
            hungerSlope: -10,
            food: -1
            // sanity      : 1,
            // sanitySlope : 1,
        },
        refuelGenerator: {
            fuelReserve: -1,
            fuelInUse: 4
            // sanitySlope : 2,
        },
        heaterOn: {
            heater: true,
            warmthSlope: 2
            // sanitySlope : 1,
        },
        heaterOff: {
            heater: false,
            warmthSlope: -2
            // sanitySlope : -1,
        },
        generatorOn: {
            generator: true,
            // sanitySlope : 1,
            fuelSlope: -1
        },
        generatorOff: {
            generator: false,
            // sanitySlope : -1,
            fuelSlope: 1
        },
        lampOn: {
            lamp: true
            // sanitySlope : 1,
        },
        lampOff: {
            lamp: false
            // sanitySlope : -1,
        }
    }

});