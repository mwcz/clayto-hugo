'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sim = function () {
    function Sim() {
        _classCallCheck(this, Sim);

        this.state = _.clone(config.INITIAL_STATE);
    }

    _createClass(Sim, [{
        key: 'eatFood',
        value: function eatFood() {
            return this.applyStateChange(config.STATE_CHANGES.eatFood);
        }
    }, {
        key: 'refuelGenerator',
        value: function refuelGenerator() {
            return this.applyStateChange(config.STATE_CHANGES.refuelGenerator);
        }
    }, {
        key: 'toggleHeater',
        value: function toggleHeater() {
            if (this.state.heater) {
                return this.applyStateChange(config.STATE_CHANGES.heaterOff);
            } else {
                return this.applyStateChange(config.STATE_CHANGES.heaterOn);
            }
        }
    }, {
        key: 'toggleGenerator',
        value: function toggleGenerator() {
            if (this.state.generator) {
                if (this.state.heater) {
                    this.applyStateChange(config.STATE_CHANGES.heaterOff);
                }
                return this.applyStateChange(config.STATE_CHANGES.generatorOff);
            } else {
                return this.applyStateChange(config.STATE_CHANGES.generatorOn);
            }
        }
    }, {
        key: 'toggleLamp',
        value: function toggleLamp() {
            if (this.state.lamp) {
                return this.applyStateChange(config.STATE_CHANGES.lampOff);
            } else {
                return this.applyStateChange(config.STATE_CHANGES.lampOn);
            }
        }
    }, {
        key: 'update',
        value: function update() {
            var timeScale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            // // update sanity
            // this.state.sanity += this.state.sanitySlope;

            // // update hunger
            // this.state.hunger += this.state.hungerSlope;

            // // update warmth
            // this.state.warmth += this.state.warmthSlope;
            var updateResults = this.applyStateChange(config.STATE_CHANGES.update, true);
            if (localStorage.debug) {
                document.querySelector('#debug').textContent = JSON.stringify(this.state, null, 4);
            }
            return updateResults;
        }
    }, {
        key: 'endLife',
        value: function endLife(deathCauses) {
            // set props to death states
            this.state.alive = false;
            this.state.hunger = 0;
            // this.state.sanity = 0;
            this.state.warmth = 0;
            this.state.hungerSlope = 0;
            // this.state.sanitySlope = 0;
            this.state.warmthSlope = 0;
            this.state.fuelInUse = 0;
            this.state.fuelReserve = 0;
            this.state.deathCauses = deathCauses;
        }
    }, {
        key: 'checkStateChange',
        value: function checkStateChange(stateChange) {
            var _this = this;

            var violations = [];
            var proceed = true;

            // quit early if already dead
            if (!this.state.alive) {
                return [{ prop: 'alive', currentValue: false, attemptedValue: false, tooHigh: false, tooLow: true }];
            }

            // check each updated prop to be sure it stays within valid bounds
            _.each(stateChange, function (v, k, i) {
                var change = v;
                if (_.isFunction(v)) {
                    change = v.call(_this);
                }

                // skip arithmetic for boolean values
                if (_.isBoolean(v)) {
                    return;
                }

                var newValue = _this.state[k] + change;
                if (newValue <= config.BOUNDS[k][0]) {
                    violations.push({
                        prop: k,
                        currentValue: _this.state[k],
                        attemptedValue: newValue,
                        tooHigh: false,
                        tooLow: true
                    });
                    proceed = false;
                    // console.log(`[sim] ${k} can't be set to ${newValue}, it is below ${config.BOUNDS[k][0]}`);
                }
                if (newValue >= config.BOUNDS[k][1]) {
                    violations.push({
                        prop: k,
                        current: _this.state[k],
                        invalid: newValue,
                        tooHigh: true,
                        tooLow: false
                    });
                    proceed = false;
                    // console.log(`[sim] ${k} can't be set to ${newValue}, it is above ${config.BOUNDS[k][1]}`);
                }
            });
            return violations;
        }
    }, {
        key: 'applyStateChange',
        value: function applyStateChange(stateChange, force) {
            var _this2 = this;

            var violations = this.checkStateChange(stateChange);

            // don't allow dying from overheating
            _.remove(violations, { prop: 'warmth', tooHigh: true });

            // catch any violations that cause death and react accordingly
            // if any of the props in violations also exist in config.DEATH_CAUSES, die
            var violationProps = _.map(violations, 'prop');
            var deathCauses = _.intersection(violationProps, config.DEATH_CAUSES);

            if (deathCauses.length) {
                console.log('[sim] dying due to ' + JSON.stringify(deathCauses));
                this.endLife(deathCauses);
            }

            // if applying the state change would cause any violations, exit early
            // and return the violations, unless forced, then apply only the
            // updates that don't cause violations
            if (violations.length && !force) {
                console.log('[sim] not applying due to violations: ' + JSON.stringify(violations, null, 4));
                return { stateChange: stateChange, violations: violations };
            } else {
                // if all props are still within valid bounds, loop and apply the new values
                console.log('[sim] applying state change: ' + JSON.stringify(stateChange, null, 4));
                _.each(stateChange, function (v, k, i) {
                    var change = v;
                    if (_.isFunction(v)) {
                        change = v.call(_this2);
                    }

                    if (_.isBoolean(v)) {
                        // if boolean, assign incoming value
                        _this2.state[k] = change;
                    } else {
                        // if not boolean, check bounds and then assign
                        var newValue = _this2.state[k] + change;
                        if (newValue >= config.BOUNDS[k][0] && newValue <= config.BOUNDS[k][1]) {
                            if (k == 'hunger' && newValue < 0) {
                                newValue = 0;
                            }
                            _this2.state[k] = newValue;
                        } else {
                            console.log('[sim] not updating ' + k + ' to out-of-bounds value: ' + newValue);
                        }
                    }
                });
                return { stateChange: stateChange, violations: violations };
            }
        }
    }, {
        key: 'print',
        value: function print() {
            console.log(JSON.stringify(this.state, null, 4));
        }
    }]);

    return Sim;
}();