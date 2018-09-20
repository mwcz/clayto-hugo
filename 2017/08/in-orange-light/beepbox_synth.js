/*
Copyright (C) 2012 John Nesky

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var beepbox;
(function (beepbox) {
    var BitFieldReader = (function () {
        function BitFieldReader(base64CharToInt, source) {
            this._bits = [];
            this._readIndex = 0;
            for (var i = 0; i < source.length; i++) {
                var value = base64CharToInt[source.charAt(i)];
                this._bits.push((value & 0x20) != 0);
                this._bits.push((value & 0x10) != 0);
                this._bits.push((value & 0x08) != 0);
                this._bits.push((value & 0x04) != 0);
                this._bits.push((value & 0x02) != 0);
                this._bits.push((value & 0x01) != 0);
            }
        }
        BitFieldReader.prototype.read = function (bitCount) {
            var result = 0;
            while (bitCount > 0) {
                result = result << 1;
                result += this._bits[this._readIndex++] ? 1 : 0;
                bitCount--;
            }
            return result;
        };
        BitFieldReader.prototype.readLongTail = function (minValue, minBits) {
            var result = minValue;
            var numBits = minBits;
            while (this._bits[this._readIndex++]) {
                result += 1 << numBits;
                numBits++;
            }
            while (numBits > 0) {
                numBits--;
                if (this._bits[this._readIndex++]) {
                    result += 1 << numBits;
                }
            }
            return result;
        };
        BitFieldReader.prototype.readPartDuration = function () {
            return this.readLongTail(1, 2);
        };
        BitFieldReader.prototype.readPinCount = function () {
            return this.readLongTail(1, 0);
        };
        BitFieldReader.prototype.readNoteInterval = function () {
            if (this.read(1)) {
                return -this.readLongTail(1, 3);
            }
            else {
                return this.readLongTail(1, 3);
            }
        };
        return BitFieldReader;
    }());
    var BitFieldWriter = (function () {
        function BitFieldWriter() {
            this._bits = [];
        }
        BitFieldWriter.prototype.write = function (bitCount, value) {
            bitCount--;
            while (bitCount >= 0) {
                this._bits.push(((value >> bitCount) & 1) == 1);
                bitCount--;
            }
        };
        BitFieldWriter.prototype.writeLongTail = function (minValue, minBits, value) {
            if (value < minValue)
                throw new Error("value out of bounds");
            value -= minValue;
            var numBits = minBits;
            while (value >= (1 << numBits)) {
                this._bits.push(true);
                value -= 1 << numBits;
                numBits++;
            }
            this._bits.push(false);
            while (numBits > 0) {
                numBits--;
                this._bits.push((value & (1 << numBits)) != 0);
            }
        };
        BitFieldWriter.prototype.writePartDuration = function (value) {
            this.writeLongTail(1, 2, value);
        };
        BitFieldWriter.prototype.writePinCount = function (value) {
            this.writeLongTail(1, 0, value);
        };
        BitFieldWriter.prototype.writeNoteInterval = function (value) {
            if (value < 0) {
                this.write(1, 1); // sign
                this.writeLongTail(1, 3, -value);
            }
            else {
                this.write(1, 0); // sign
                this.writeLongTail(1, 3, value);
            }
        };
        BitFieldWriter.prototype.concat = function (other) {
            this._bits = this._bits.concat(other._bits);
        };
        BitFieldWriter.prototype.encodeBase64 = function (base64IntToChar) {
            var result = "";
            for (var i = 0; i < this._bits.length; i += 6) {
                var value = 0;
                if (this._bits[i + 0])
                    value += 0x20;
                if (this._bits[i + 1])
                    value += 0x10;
                if (this._bits[i + 2])
                    value += 0x08;
                if (this._bits[i + 3])
                    value += 0x04;
                if (this._bits[i + 4])
                    value += 0x02;
                if (this._bits[i + 5])
                    value += 0x01;
                result += base64IntToChar[value];
            }
            return result;
        };
        return BitFieldWriter;
    }());
    var Music = (function () {
        function Music() {
        }
        return Music;
    }());
    Music.scaleNames = ["easy :)", "easy :(", "island :)", "island :(", "blues :)", "blues :(", "normal :)", "normal :(", "romani :)", "romani :(", "enigma", "expert"];
    Music.scaleFlags = [
        [true, false, true, false, true, false, false, true, false, true, false, false],
        [true, false, false, true, false, true, false, true, false, false, true, false],
        [true, false, false, false, true, true, false, true, false, false, false, true],
        [true, true, false, true, false, false, false, true, true, false, false, false],
        [true, false, true, true, true, false, false, true, false, true, false, false],
        [true, false, false, true, false, true, true, true, false, false, true, false],
        [true, false, true, false, true, true, false, true, false, true, false, true],
        [true, false, true, true, false, true, false, true, true, false, true, false],
        [true, true, false, false, true, true, false, true, true, false, true, false],
        [true, false, true, true, false, false, true, true, true, false, false, true],
        [true, false, true, false, true, false, true, false, true, false, true, false],
        [true, true, true, true, true, true, true, true, true, true, true, true],
    ];
    Music.pianoScaleFlags = [true, false, true, false, true, true, false, true, false, true, false, true];
    // C1 has index 24 on the MIDI scale. C8 is 108, and C9 is 120. C10 is barely in the audible range.
    Music.blackKeyNameParents = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1];
    Music.noteNames = ["C", null, "D", null, "E", "F", null, "G", null, "A", null, "B"];
    Music.keyNames = ["B", "A♯", "A", "G♯", "G", "F♯", "F", "E", "D♯", "D", "C♯", "C"];
    Music.keyTransposes = [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12];
    Music.tempoNames = ["molasses", "slow", "leisurely", "moderate", "steady", "brisk", "hasty", "fast", "strenuous", "grueling", "hyper", "ludicrous"];
    Music.reverbRange = 4;
    Music.beatsMin = 3;
    Music.beatsMax = 15;
    Music.barsMin = 1;
    Music.barsMax = 128;
    Music.patternsMin = 1;
    Music.patternsMax = 64;
    Music.instrumentsMin = 1;
    Music.instrumentsMax = 10;
    Music.partNames = ["triples", "standard"];
    Music.partCounts = [3, 4];
    Music.waveNames = ["triangle", "square", "pulse wide", "pulse narrow", "sawtooth", "double saw", "double pulse", "spiky", "plateau"];
    Music.waveVolumes = [1.0, 0.5, 0.5, 0.5, 0.65, 0.5, 0.4, 0.4, 0.94];
    Music.drumNames = ["retro", "white"];
    Music.drumVolumes = [0.25, 1.0];
    Music.filterNames = ["sustain sharp", "sustain medium", "sustain soft", "decay sharp", "decay medium", "decay soft"];
    Music.filterBases = [2.0, 3.5, 5.0, 1.0, 2.5, 4.0];
    Music.filterDecays = [0.0, 0.0, 0.0, 10.0, 7.0, 4.0];
    Music.filterVolumes = [0.4, 0.7, 1.0, 0.5, 0.75, 1.0];
    Music.attackNames = ["binary", "sudden", "smooth", "slide"];
    Music.effectNames = ["none", "vibrato light", "vibrato delayed", "vibrato heavy", "tremelo light", "tremelo heavy"];
    Music.effectVibratos = [0.0, 0.15, 0.3, 0.45, 0.0, 0.0];
    Music.effectTremelos = [0.0, 0.0, 0.0, 0.0, 0.25, 0.5];
    Music.chorusNames = ["union", "shimmer", "hum", "honky tonk", "dissonant", "fifths", "octaves", "bowed"];
    Music.chorusValues = [0.0, 0.02, 0.05, 0.1, 0.25, 3.5, 6, 0.02];
    Music.chorusOffsets = [0.0, 0.0, 0.0, 0.0, 0.0, 3.5, 6, 0.0];
    Music.chorusVolumes = [0.7, 0.8, 1.0, 1.0, 0.9, 0.9, 0.8, 1.0];
    Music.volumeNames = ["loudest", "loud", "medium", "quiet", "quietest", "mute"];
    Music.volumeValues = [0.0, 0.5, 1.0, 1.5, 2.0, -1.0];
    Music.channelVolumes = [0.27, 0.27, 0.27, 0.19];
    Music.drumInterval = 6;
    Music.numChannels = 4;
    Music.drumCount = 12;
    Music.noteCount = 37;
    Music.maxPitch = 84;
    beepbox.Music = Music;
    var TonePin = (function () {
        function TonePin(interval, time, volume) {
            this.interval = interval;
            this.time = time;
            this.volume = volume;
        }
        return TonePin;
    }());
    beepbox.TonePin = TonePin;
    var Tone = (function () {
        function Tone(note, start, end, volume, fadeout) {
            if (fadeout === void 0) { fadeout = false; }
            this.notes = [note];
            this.pins = [new TonePin(0, 0, volume), new TonePin(0, end - start, fadeout ? 0 : volume)];
            this.start = start;
            this.end = end;
        }
        return Tone;
    }());
    beepbox.Tone = Tone;
    var BarPattern = (function () {
        function BarPattern() {
            this.tones = [];
            this.instrument = 0;
        }
        BarPattern.prototype.cloneTones = function () {
            var result = [];
            for (var _i = 0, _a = this.tones; _i < _a.length; _i++) {
                var oldTone = _a[_i];
                var newTone = new Tone(-1, oldTone.start, oldTone.end, 3);
                newTone.notes = oldTone.notes.concat();
                newTone.pins = [];
                for (var _b = 0, _c = oldTone.pins; _b < _c.length; _b++) {
                    var oldPin = _c[_b];
                    newTone.pins.push(new TonePin(oldPin.interval, oldPin.time, oldPin.volume));
                }
                result.push(newTone);
            }
            return result;
        };
        return BarPattern;
    }());
    beepbox.BarPattern = BarPattern;
    var Song = (function () {
        function Song(string) {
            if (string === void 0) { string = null; }
            if (string != null) {
                this.fromString(string);
            }
            else {
                this.initToDefault();
            }
        }
        Song.prototype.initToDefault = function () {
            this.channelPatterns = [
                [new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern()],
                [new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern()],
                [new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern()],
                [new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern(), new BarPattern()],
            ];
            this.channelBars = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ];
            this.channelOctaves = [3, 2, 1, 0];
            this.instrumentVolumes = [[0], [0], [0], [0]];
            this.instrumentWaves = [[1], [1], [1], [1]];
            this.instrumentFilters = [[0], [0], [0], [0]];
            this.instrumentAttacks = [[1], [1], [1], [1]];
            this.instrumentEffects = [[0], [0], [0], [0]];
            this.instrumentChorus = [[0], [0], [0], [0]];
            this.scale = 0;
            this.key = Music.keyNames.length - 1;
            this.loopStart = 0;
            this.loopLength = 4;
            this.tempo = 7;
            this.reverb = 0;
            this.beats = 8;
            this.bars = 16;
            this.patterns = 8;
            this.parts = 4;
            this.instruments = 1;
        };
        Song.prototype.toString = function () {
            var channel;
            var bits;
            var result = "";
            var base64IntToChar = Song._base64IntToChar;
            result += base64IntToChar[Song._latestVersion];
            result += "s" + base64IntToChar[this.scale];
            result += "k" + base64IntToChar[this.key];
            result += "l" + base64IntToChar[this.loopStart >> 6] + base64IntToChar[this.loopStart & 0x3f];
            result += "e" + base64IntToChar[(this.loopLength - 1) >> 6] + base64IntToChar[(this.loopLength - 1) & 0x3f];
            result += "t" + base64IntToChar[this.tempo];
            result += "m" + base64IntToChar[this.reverb];
            result += "a" + base64IntToChar[this.beats - 1];
            result += "g" + base64IntToChar[(this.bars - 1) >> 6] + base64IntToChar[(this.bars - 1) & 0x3f];
            result += "j" + base64IntToChar[this.patterns - 1];
            result += "i" + base64IntToChar[this.instruments - 1];
            result += "r" + base64IntToChar[Music.partCounts.indexOf(this.parts)];
            result += "w";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentWaves[channel][i]];
                }
            result += "f";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentFilters[channel][i]];
                }
            result += "d";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentAttacks[channel][i]];
                }
            result += "c";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentEffects[channel][i]];
                }
            result += "h";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentChorus[channel][i]];
                }
            result += "v";
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.instruments; i++) {
                    result += base64IntToChar[this.instrumentVolumes[channel][i]];
                }
            result += "o";
            for (channel = 0; channel < Music.numChannels; channel++) {
                result += base64IntToChar[this.channelOctaves[channel]];
            }
            result += "b";
            bits = new BitFieldWriter();
            var neededBits = 0;
            while ((1 << neededBits) < this.patterns + 1)
                neededBits++;
            for (channel = 0; channel < Music.numChannels; channel++)
                for (var i = 0; i < this.bars; i++) {
                    bits.write(neededBits, this.channelBars[channel][i]);
                }
            result += bits.encodeBase64(base64IntToChar);
            result += "p";
            bits = new BitFieldWriter();
            var neededInstrumentBits = 0;
            while ((1 << neededInstrumentBits) < this.instruments)
                neededInstrumentBits++;
            for (channel = 0; channel < Music.numChannels; channel++) {
                var octaveOffset = channel == 3 ? 0 : this.channelOctaves[channel] * 12;
                var lastNote = (channel == 3 ? 4 : 12) + octaveOffset;
                var recentNotes = channel == 3 ? [4, 6, 7, 2, 3, 8, 0, 10] : [12, 19, 24, 31, 36, 7, 0];
                var recentShapes = [];
                for (var i = 0; i < recentNotes.length; i++) {
                    recentNotes[i] += octaveOffset;
                }
                for (var _i = 0, _a = this.channelPatterns[channel]; _i < _a.length; _i++) {
                    var p = _a[_i];
                    bits.write(neededInstrumentBits, p.instrument);
                    if (p.tones.length > 0) {
                        bits.write(1, 1);
                        var curPart = 0;
                        for (var _b = 0, _c = p.tones; _b < _c.length; _b++) {
                            var t = _c[_b];
                            if (t.start > curPart) {
                                bits.write(2, 0); // rest
                                bits.writePartDuration(t.start - curPart);
                            }
                            var shapeBits = new BitFieldWriter();
                            // 0: 1 note, 10: 2 notes, 110: 3 notes, 111: 4 notes
                            for (var i = 1; i < t.notes.length; i++)
                                shapeBits.write(1, 1);
                            if (t.notes.length < 4)
                                shapeBits.write(1, 0);
                            shapeBits.writePinCount(t.pins.length - 1);
                            shapeBits.write(2, t.pins[0].volume); // volume
                            var shapePart = 0;
                            var startNote = t.notes[0];
                            var currentNote = startNote;
                            var pitchBends = [];
                            for (var i = 1; i < t.pins.length; i++) {
                                var pin = t.pins[i];
                                var nextNote = startNote + pin.interval;
                                if (currentNote != nextNote) {
                                    shapeBits.write(1, 1);
                                    pitchBends.push(nextNote);
                                    currentNote = nextNote;
                                }
                                else {
                                    shapeBits.write(1, 0);
                                }
                                shapeBits.writePartDuration(pin.time - shapePart);
                                shapePart = pin.time;
                                shapeBits.write(2, pin.volume);
                            }
                            var shapeString = shapeBits.encodeBase64(base64IntToChar);
                            var shapeIndex = recentShapes.indexOf(shapeString);
                            if (shapeIndex == -1) {
                                bits.write(2, 1); // new shape
                                bits.concat(shapeBits);
                            }
                            else {
                                bits.write(1, 1); // old shape
                                bits.writeLongTail(0, 0, shapeIndex);
                                recentShapes.splice(shapeIndex, 1);
                            }
                            recentShapes.unshift(shapeString);
                            if (recentShapes.length > 10)
                                recentShapes.pop();
                            var allNotes = t.notes.concat(pitchBends);
                            for (var i = 0; i < allNotes.length; i++) {
                                var note = allNotes[i];
                                var noteIndex = recentNotes.indexOf(note);
                                if (noteIndex == -1) {
                                    var interval = 0;
                                    var noteIter = lastNote;
                                    if (noteIter < note) {
                                        while (noteIter != note) {
                                            noteIter++;
                                            if (recentNotes.indexOf(noteIter) == -1)
                                                interval++;
                                        }
                                    }
                                    else {
                                        while (noteIter != note) {
                                            noteIter--;
                                            if (recentNotes.indexOf(noteIter) == -1)
                                                interval--;
                                        }
                                    }
                                    bits.write(1, 0);
                                    bits.writeNoteInterval(interval);
                                }
                                else {
                                    bits.write(1, 1);
                                    bits.write(3, noteIndex);
                                    recentNotes.splice(noteIndex, 1);
                                }
                                recentNotes.unshift(note);
                                if (recentNotes.length > 8)
                                    recentNotes.pop();
                                if (i == t.notes.length - 1) {
                                    lastNote = t.notes[0];
                                }
                                else {
                                    lastNote = note;
                                }
                            }
                            curPart = t.end;
                        }
                        if (curPart < this.beats * this.parts) {
                            bits.write(2, 0); // rest
                            bits.writePartDuration(this.beats * this.parts - curPart);
                        }
                    }
                    else {
                        bits.write(1, 0);
                    }
                }
            }
            var bitString = bits.encodeBase64(base64IntToChar);
            var stringLength = bitString.length;
            var digits = "";
            while (stringLength > 0) {
                digits = base64IntToChar[stringLength & 0x3f] + digits;
                stringLength = stringLength >> 6;
            }
            result += base64IntToChar[digits.length];
            result += digits;
            result += bitString;
            return result;
        };
        Song.prototype.fromString = function (compressed) {
            compressed = compressed.trim();
            if (compressed.charAt(0) == "#")
                compressed = compressed.substring(1);
            if (compressed == null || compressed.length == 0) {
                this.initToDefault();
                return;
            }
            if (compressed.charAt(0) == "{") {
                this.fromJsonObject(JSON.parse(compressed));
                return;
            }
            this.initToDefault();
            var charIndex = 0;
            var version = Song._base64CharToInt[compressed.charAt(charIndex++)];
            if (version == -1 || version > Song._latestVersion || version < Song._oldestVersion)
                return;
            var beforeThree = version < 3;
            var beforeFour = version < 4;
            var beforeFive = version < 5;
            var base64CharToInt = Song._base64CharToInt; // beforeThree ? Song._oldBase64 : Song._newBase64;
            if (beforeThree)
                this.instrumentAttacks = [[0], [0], [0], [0]];
            if (beforeThree)
                this.instrumentWaves = [[1], [1], [1], [0]];
            while (charIndex < compressed.length) {
                var command = compressed.charAt(charIndex++);
                var channel = void 0;
                if (command == "s") {
                    this.scale = base64CharToInt[compressed.charAt(charIndex++)];
                    if (beforeThree && this.scale == 10)
                        this.scale = 11;
                }
                else if (command == "k") {
                    this.key = base64CharToInt[compressed.charAt(charIndex++)];
                }
                else if (command == "l") {
                    if (beforeFive) {
                        this.loopStart = base64CharToInt[compressed.charAt(charIndex++)];
                    }
                    else {
                        this.loopStart = (base64CharToInt[compressed.charAt(charIndex++)] << 6) + base64CharToInt[compressed.charAt(charIndex++)];
                    }
                }
                else if (command == "e") {
                    if (beforeFive) {
                        this.loopLength = base64CharToInt[compressed.charAt(charIndex++)];
                    }
                    else {
                        this.loopLength = (base64CharToInt[compressed.charAt(charIndex++)] << 6) + base64CharToInt[compressed.charAt(charIndex++)] + 1;
                    }
                }
                else if (command == "t") {
                    if (beforeFour) {
                        this.tempo = [1, 4, 7, 10][base64CharToInt[compressed.charAt(charIndex++)]];
                    }
                    else {
                        this.tempo = base64CharToInt[compressed.charAt(charIndex++)];
                    }
                    this.tempo = this._clip(0, Music.tempoNames.length, this.tempo);
                }
                else if (command == "m") {
                    this.reverb = base64CharToInt[compressed.charAt(charIndex++)];
                    this.reverb = this._clip(0, Music.reverbRange, this.reverb);
                }
                else if (command == "a") {
                    if (beforeThree) {
                        this.beats = [6, 7, 8, 9, 10][base64CharToInt[compressed.charAt(charIndex++)]];
                    }
                    else {
                        this.beats = base64CharToInt[compressed.charAt(charIndex++)] + 1;
                    }
                    this.beats = Math.max(Music.beatsMin, Math.min(Music.beatsMax, this.beats));
                }
                else if (command == "g") {
                    this.bars = (base64CharToInt[compressed.charAt(charIndex++)] << 6) + base64CharToInt[compressed.charAt(charIndex++)] + 1;
                    this.bars = Math.max(Music.barsMin, Math.min(Music.barsMax, this.bars));
                }
                else if (command == "j") {
                    this.patterns = base64CharToInt[compressed.charAt(charIndex++)] + 1;
                    this.patterns = Math.max(Music.patternsMin, Math.min(Music.patternsMax, this.patterns));
                }
                else if (command == "i") {
                    this.instruments = base64CharToInt[compressed.charAt(charIndex++)] + 1;
                    this.instruments = Math.max(Music.instrumentsMin, Math.min(Music.instrumentsMax, this.instruments));
                }
                else if (command == "r") {
                    this.parts = Music.partCounts[base64CharToInt[compressed.charAt(charIndex++)]];
                }
                else if (command == "w") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentWaves[channel][0] = this._clip(0, Music.waveNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentWaves[channel][i] = this._clip(0, Music.waveNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "f") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentFilters[channel][0] = [0, 2, 3, 5][this._clip(0, Music.filterNames.length, base64CharToInt[compressed.charAt(charIndex++)])];
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentFilters[channel][i] = this._clip(0, Music.filterNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "d") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentAttacks[channel][0] = this._clip(0, Music.attackNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentAttacks[channel][i] = this._clip(0, Music.attackNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "c") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentEffects[channel][0] = this._clip(0, Music.effectNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                        if (this.instrumentEffects[channel][0] == 1)
                            this.instrumentEffects[channel][0] = 3;
                        else if (this.instrumentEffects[channel][0] == 3)
                            this.instrumentEffects[channel][0] = 5;
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentEffects[channel][i] = this._clip(0, Music.effectNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "h") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentChorus[channel][0] = this._clip(0, Music.chorusNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentChorus[channel][i] = this._clip(0, Music.chorusNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "v") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.instrumentVolumes[channel][0] = this._clip(0, Music.volumeNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            for (var i = 0; i < this.instruments; i++) {
                                this.instrumentVolumes[channel][i] = this._clip(0, Music.volumeNames.length, base64CharToInt[compressed.charAt(charIndex++)]);
                            }
                        }
                    }
                }
                else if (command == "o") {
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        this.channelOctaves[channel] = this._clip(0, 5, base64CharToInt[compressed.charAt(charIndex++)]);
                    }
                    else {
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            this.channelOctaves[channel] = this._clip(0, 5, base64CharToInt[compressed.charAt(charIndex++)]);
                        }
                    }
                }
                else if (command == "b") {
                    var subStringLength = void 0;
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        var barCount = base64CharToInt[compressed.charAt(charIndex++)];
                        subStringLength = Math.ceil(barCount * 0.5);
                        var bits = new BitFieldReader(base64CharToInt, compressed.substr(charIndex, subStringLength));
                        for (var i = 0; i < barCount; i++) {
                            this.channelBars[channel][i] = bits.read(3) + 1;
                        }
                    }
                    else if (beforeFive) {
                        var neededBits = 0;
                        while ((1 << neededBits) < this.patterns)
                            neededBits++;
                        subStringLength = Math.ceil(Music.numChannels * this.bars * neededBits / 6);
                        var bits = new BitFieldReader(base64CharToInt, compressed.substr(charIndex, subStringLength));
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            this.channelBars[channel].length = this.bars;
                            for (var i = 0; i < this.bars; i++) {
                                this.channelBars[channel][i] = bits.read(neededBits) + 1;
                            }
                        }
                    }
                    else {
                        var neededBits2 = 0;
                        while ((1 << neededBits2) < this.patterns + 1)
                            neededBits2++;
                        subStringLength = Math.ceil(Music.numChannels * this.bars * neededBits2 / 6);
                        var bits = new BitFieldReader(base64CharToInt, compressed.substr(charIndex, subStringLength));
                        for (channel = 0; channel < Music.numChannels; channel++) {
                            this.channelBars[channel].length = this.bars;
                            for (var i = 0; i < this.bars; i++) {
                                this.channelBars[channel][i] = bits.read(neededBits2);
                            }
                        }
                    }
                    charIndex += subStringLength;
                }
                else if (command == "p") {
                    var bitStringLength = 0;
                    if (beforeThree) {
                        channel = base64CharToInt[compressed.charAt(charIndex++)];
                        // The old format used the next character to represent the number of patterns in the channel, which is usually eight, the default. 
                        charIndex++; //let patternCount: number = base64CharToInt[compressed.charAt(charIndex++)];
                        bitStringLength = base64CharToInt[compressed.charAt(charIndex++)];
                        bitStringLength = bitStringLength << 6;
                        bitStringLength += base64CharToInt[compressed.charAt(charIndex++)];
                    }
                    else {
                        channel = 0;
                        var bitStringLengthLength = base64CharToInt[compressed.charAt(charIndex++)];
                        while (bitStringLengthLength > 0) {
                            bitStringLength = bitStringLength << 6;
                            bitStringLength += base64CharToInt[compressed.charAt(charIndex++)];
                            bitStringLengthLength--;
                        }
                    }
                    var bits = new BitFieldReader(base64CharToInt, compressed.substr(charIndex, bitStringLength));
                    charIndex += bitStringLength;
                    var neededInstrumentBits = 0;
                    while ((1 << neededInstrumentBits) < this.instruments)
                        neededInstrumentBits++;
                    while (true) {
                        this.channelPatterns[channel] = [];
                        var octaveOffset = channel == 3 ? 0 : this.channelOctaves[channel] * 12;
                        var tone = null;
                        var pin = null;
                        var lastNote = (channel == 3 ? 4 : 12) + octaveOffset;
                        var recentNotes = channel == 3 ? [4, 6, 7, 2, 3, 8, 0, 10] : [12, 19, 24, 31, 36, 7, 0];
                        var recentShapes = [];
                        for (var i = 0; i < recentNotes.length; i++) {
                            recentNotes[i] += octaveOffset;
                        }
                        for (var i = 0; i < this.patterns; i++) {
                            var newPattern = new BarPattern();
                            newPattern.instrument = bits.read(neededInstrumentBits);
                            this.channelPatterns[channel][i] = newPattern;
                            if (!beforeThree && bits.read(1) == 0)
                                continue;
                            var curPart = 0;
                            var newTones = [];
                            while (curPart < this.beats * this.parts) {
                                var useOldShape = bits.read(1) == 1;
                                var newTone = false;
                                var shapeIndex = 0;
                                if (useOldShape) {
                                    shapeIndex = bits.readLongTail(0, 0);
                                }
                                else {
                                    newTone = bits.read(1) == 1;
                                }
                                if (!useOldShape && !newTone) {
                                    var restLength = bits.readPartDuration();
                                    curPart += restLength;
                                }
                                else {
                                    var shape = void 0;
                                    var pinObj = void 0;
                                    var note = void 0;
                                    if (useOldShape) {
                                        shape = recentShapes[shapeIndex];
                                        recentShapes.splice(shapeIndex, 1);
                                    }
                                    else {
                                        shape = {};
                                        shape.noteCount = 1;
                                        while (shape.noteCount < 4 && bits.read(1) == 1)
                                            shape.noteCount++;
                                        shape.pinCount = bits.readPinCount();
                                        shape.initialVolume = bits.read(2);
                                        shape.pins = [];
                                        shape.length = 0;
                                        shape.bendCount = 0;
                                        for (var j = 0; j < shape.pinCount; j++) {
                                            pinObj = {};
                                            pinObj.pitchBend = bits.read(1) == 1;
                                            if (pinObj.pitchBend)
                                                shape.bendCount++;
                                            shape.length += bits.readPartDuration();
                                            pinObj.time = shape.length;
                                            pinObj.volume = bits.read(2);
                                            shape.pins.push(pinObj);
                                        }
                                    }
                                    recentShapes.unshift(shape);
                                    if (recentShapes.length > 10)
                                        recentShapes.pop();
                                    tone = new Tone(0, curPart, curPart + shape.length, shape.initialVolume);
                                    tone.notes = [];
                                    tone.pins.length = 1;
                                    var pitchBends = [];
                                    for (var j = 0; j < shape.noteCount + shape.bendCount; j++) {
                                        var useOldNote = bits.read(1) == 1;
                                        if (!useOldNote) {
                                            var interval = bits.readNoteInterval();
                                            note = lastNote;
                                            var intervalIter = interval;
                                            while (intervalIter > 0) {
                                                note++;
                                                while (recentNotes.indexOf(note) != -1)
                                                    note++;
                                                intervalIter--;
                                            }
                                            while (intervalIter < 0) {
                                                note--;
                                                while (recentNotes.indexOf(note) != -1)
                                                    note--;
                                                intervalIter++;
                                            }
                                        }
                                        else {
                                            var noteIndex = bits.read(3);
                                            note = recentNotes[noteIndex];
                                            recentNotes.splice(noteIndex, 1);
                                        }
                                        recentNotes.unshift(note);
                                        if (recentNotes.length > 8)
                                            recentNotes.pop();
                                        if (j < shape.noteCount) {
                                            tone.notes.push(note);
                                        }
                                        else {
                                            pitchBends.push(note);
                                        }
                                        if (j == shape.noteCount - 1) {
                                            lastNote = tone.notes[0];
                                        }
                                        else {
                                            lastNote = note;
                                        }
                                    }
                                    pitchBends.unshift(tone.notes[0]);
                                    for (var _i = 0, _a = shape.pins; _i < _a.length; _i++) {
                                        var pinObj_1 = _a[_i];
                                        if (pinObj_1.pitchBend)
                                            pitchBends.shift();
                                        pin = new TonePin(pitchBends[0] - tone.notes[0], pinObj_1.time, pinObj_1.volume);
                                        tone.pins.push(pin);
                                    }
                                    curPart = tone.end;
                                    newTones.push(tone);
                                }
                            }
                            newPattern.tones = newTones;
                        } // for (let i: number = 0; i < patterns; i++) {
                        if (beforeThree) {
                            break;
                        }
                        else {
                            channel++;
                            if (channel >= Music.numChannels)
                                break;
                        }
                    } // while (true)
                }
            }
        };
        Song.prototype.toJsonObject = function (enableIntro, loopCount, enableOutro) {
            if (enableIntro === void 0) { enableIntro = true; }
            if (loopCount === void 0) { loopCount = 1; }
            if (enableOutro === void 0) { enableOutro = true; }
            var channelArray = [];
            for (var channel = 0; channel < Music.numChannels; channel++) {
                var instrumentArray = [];
                for (var i = 0; i < this.instruments; i++) {
                    if (channel == 3) {
                        instrumentArray.push({
                            volume: (5 - this.instrumentVolumes[channel][i]) * 20,
                            wave: Music.drumNames[this.instrumentWaves[channel][i]],
                            envelope: Music.attackNames[this.instrumentAttacks[channel][i]],
                        });
                    }
                    else {
                        instrumentArray.push({
                            volume: (5 - this.instrumentVolumes[channel][i]) * 20,
                            wave: Music.waveNames[this.instrumentWaves[channel][i]],
                            envelope: Music.attackNames[this.instrumentAttacks[channel][i]],
                            filter: Music.filterNames[this.instrumentFilters[channel][i]],
                            chorus: Music.chorusNames[this.instrumentChorus[channel][i]],
                            effect: Music.effectNames[this.instrumentEffects[channel][i]],
                        });
                    }
                }
                var patternArray = [];
                for (var _i = 0, _a = this.channelPatterns[channel]; _i < _a.length; _i++) {
                    var pattern = _a[_i];
                    var noteArray = [];
                    for (var _b = 0, _c = pattern.tones; _b < _c.length; _b++) {
                        var tone = _c[_b];
                        var pointArray = [];
                        for (var _d = 0, _e = tone.pins; _d < _e.length; _d++) {
                            var pin = _e[_d];
                            pointArray.push({
                                tick: pin.time + tone.start,
                                pitchBend: pin.interval,
                                volume: Math.round(pin.volume * 100 / 3),
                            });
                        }
                        noteArray.push({
                            pitches: tone.notes,
                            points: pointArray,
                        });
                    }
                    patternArray.push({
                        instrument: pattern.instrument + 1,
                        notes: noteArray,
                    });
                }
                var sequenceArray = [];
                if (enableIntro)
                    for (var i = 0; i < this.loopStart; i++) {
                        sequenceArray.push(this.channelBars[channel][i]);
                    }
                for (var l = 0; l < loopCount; l++)
                    for (var i = this.loopStart; i < this.loopStart + this.loopLength; i++) {
                        sequenceArray.push(this.channelBars[channel][i]);
                    }
                if (enableOutro)
                    for (var i = this.loopStart + this.loopLength; i < this.bars; i++) {
                        sequenceArray.push(this.channelBars[channel][i]);
                    }
                channelArray.push({
                    octaveScrollBar: this.channelOctaves[channel],
                    instruments: instrumentArray,
                    patterns: patternArray,
                    sequence: sequenceArray,
                });
            }
            return {
                version: Song._latestVersion,
                scale: Music.scaleNames[this.scale],
                key: Music.keyNames[this.key],
                introBars: this.loopStart,
                loopBars: this.loopLength,
                beatsPerBar: this.beats,
                ticksPerBeat: this.parts,
                beatsPerMinute: this.getBeatsPerMinute(),
                reverb: this.reverb,
                //outroBars: this.bars - this.loopStart - this.loopLength; // derive this from bar arrays?
                //patternCount: this.patterns, // derive this from pattern arrays?
                //instrumentsPerChannel: this.instruments, //derive this from instrument arrays?
                channels: channelArray,
            };
        };
        Song.prototype.fromJsonObject = function (jsonObject) {
            this.initToDefault();
            if (!jsonObject)
                return;
            var version = jsonObject.version;
            if (version !== 5)
                return;
            this.scale = 11; // default to expert.
            if (jsonObject.scale != undefined) {
                var scale = Music.scaleNames.indexOf(jsonObject.scale);
                if (scale != -1)
                    this.scale = scale;
            }
            if (jsonObject.key != undefined) {
                if (typeof (jsonObject.key) == "number") {
                    this.key = Music.keyNames.length - 1 - (((jsonObject.key + 1200) >>> 0) % Music.keyNames.length);
                }
                else if (typeof (jsonObject.key) == "string") {
                    var key = jsonObject.key;
                    var letter = key.charAt(0).toUpperCase();
                    var symbol = key.charAt(1).toLowerCase();
                    var letterMap = { "C": 11, "D": 9, "E": 7, "F": 6, "G": 4, "A": 2, "B": 0 };
                    var accidentalMap = { "#": -1, "♯": -1, "b": 1, "♭": 1 };
                    var index = letterMap[letter];
                    var offset = accidentalMap[symbol];
                    if (index != undefined) {
                        if (offset != undefined)
                            index += offset;
                        if (index < 0)
                            index += 12;
                        index = index % 12;
                        this.key = index;
                    }
                }
            }
            if (jsonObject.beatsPerMinute != undefined) {
                var bpm = jsonObject.beatsPerMinute | 0;
                this.tempo = Math.round(4.0 + 9.0 * Math.log(bpm / 120) / Math.LN2);
                this.tempo = this._clip(0, Music.tempoNames.length, this.tempo);
            }
            if (jsonObject.reverb != undefined) {
                this.reverb = this._clip(0, Music.reverbRange, jsonObject.reverb | 0);
            }
            if (jsonObject.beatsPerBar != undefined) {
                this.beats = Math.max(Music.beatsMin, Math.min(Music.beatsMax, jsonObject.beatsPerBar | 0));
            }
            if (jsonObject.ticksPerBeat != undefined) {
                this.parts = Math.max(3, Math.min(4, jsonObject.ticksPerBeat | 0));
            }
            var maxInstruments = 1;
            var maxPatterns = 1;
            var maxBars = 1;
            for (var channel = 0; channel < Music.numChannels; channel++) {
                if (jsonObject.channels && jsonObject.channels[channel]) {
                    var channelObject = jsonObject.channels[channel];
                    if (channelObject.instruments)
                        maxInstruments = Math.max(maxInstruments, channelObject.instruments.length | 0);
                    if (channelObject.patterns)
                        maxPatterns = Math.max(maxPatterns, channelObject.patterns.length | 0);
                    if (channelObject.sequence)
                        maxBars = Math.max(maxBars, channelObject.sequence.length | 0);
                }
            }
            this.instruments = maxInstruments;
            this.patterns = maxPatterns;
            this.bars = maxBars;
            if (jsonObject.introBars != undefined) {
                this.loopStart = this._clip(0, this.bars, jsonObject.introBars | 0);
            }
            if (jsonObject.loopBars != undefined) {
                this.loopLength = this._clip(1, this.bars - this.loopStart + 1, jsonObject.loopBars | 0);
            }
            for (var channel = 0; channel < Music.numChannels; channel++) {
                var channelObject = undefined;
                if (jsonObject.channels)
                    channelObject = jsonObject.channels[channel];
                if (channelObject == undefined)
                    channelObject = {};
                if (channelObject.octaveScrollBar != undefined) {
                    this.channelOctaves[channel] = this._clip(0, 5, channelObject.octaveScrollBar | 0);
                }
                this.instrumentVolumes[channel].length = this.instruments;
                this.instrumentWaves[channel].length = this.instruments;
                this.instrumentAttacks[channel].length = this.instruments;
                this.instrumentFilters[channel].length = this.instruments;
                this.instrumentChorus[channel].length = this.instruments;
                this.instrumentEffects[channel].length = this.instruments;
                this.channelPatterns[channel].length = this.patterns;
                this.channelBars[channel].length = this.bars;
                for (var i = 0; i < this.instruments; i++) {
                    var instrumentObject = undefined;
                    if (channelObject.instruments)
                        instrumentObject = channelObject.instruments[i];
                    if (instrumentObject == undefined)
                        instrumentObject = {};
                    if (instrumentObject.volume != undefined) {
                        this.instrumentVolumes[channel][i] = this._clip(0, Music.volumeNames.length, Math.round(5 - (instrumentObject.volume | 0) / 20));
                    }
                    else {
                        this.instrumentVolumes[channel][i] = 0;
                    }
                    this.instrumentAttacks[channel][i] = Music.attackNames.indexOf(instrumentObject.envelope);
                    if (this.instrumentAttacks[channel][i] == -1)
                        this.instrumentAttacks[channel][i] = 1;
                    if (channel == 3) {
                        this.instrumentWaves[channel][i] = Music.drumNames.indexOf(instrumentObject.wave);
                        if (this.instrumentWaves[channel][i] == -1)
                            this.instrumentWaves[channel][i] = 0;
                        this.instrumentFilters[channel][i] = 0;
                        this.instrumentChorus[channel][i] = 0;
                        this.instrumentEffects[channel][i] = 0;
                    }
                    else {
                        this.instrumentWaves[channel][i] = Music.waveNames.indexOf(instrumentObject.wave);
                        if (this.instrumentWaves[channel][i] == -1)
                            this.instrumentWaves[channel][i] = 1;
                        this.instrumentFilters[channel][i] = Music.filterNames.indexOf(instrumentObject.filter);
                        if (this.instrumentFilters[channel][i] == -1)
                            this.instrumentFilters[channel][i] = 0;
                        this.instrumentChorus[channel][i] = Music.chorusNames.indexOf(instrumentObject.chorus);
                        if (this.instrumentChorus[channel][i] == -1)
                            this.instrumentChorus[channel][i] = 0;
                        this.instrumentEffects[channel][i] = Music.effectNames.indexOf(instrumentObject.effect);
                        if (this.instrumentEffects[channel][i] == -1)
                            this.instrumentEffects[channel][i] = 0;
                    }
                }
                for (var i = 0; i < this.patterns; i++) {
                    var pattern = new BarPattern();
                    this.channelPatterns[channel][i] = pattern;
                    var patternObject = undefined;
                    if (channelObject.patterns)
                        patternObject = channelObject.patterns[i];
                    if (patternObject == undefined)
                        continue;
                    pattern.instrument = this._clip(0, this.instruments, (patternObject.instrument | 0) - 1);
                    if (patternObject.notes && patternObject.notes.length > 0) {
                        var maxToneCount = Math.min(this.beats * this.parts, patternObject.notes.length >>> 0);
                        ///@TODO: Consider supporting notes specified in any timing order, sorting them and truncating as necessary. 
                        var tickClock = 0;
                        for (var j = 0; j < patternObject.notes.length; j++) {
                            if (j >= maxToneCount)
                                break;
                            var noteObject = patternObject.notes[j];
                            if (!noteObject || !noteObject.pitches || !(noteObject.pitches.length >= 1) || !noteObject.points || !(noteObject.points.length >= 2)) {
                                continue;
                            }
                            var tone = new Tone(0, 0, 0, 0);
                            tone.notes = [];
                            tone.pins = [];
                            for (var k = 0; k < noteObject.pitches.length; k++) {
                                var pitch = noteObject.pitches[k] | 0;
                                if (tone.notes.indexOf(pitch) != -1)
                                    continue;
                                tone.notes.push(pitch);
                                if (tone.notes.length >= 4)
                                    break;
                            }
                            if (tone.notes.length < 1)
                                continue;
                            var toneClock = tickClock;
                            var startInterval = 0;
                            for (var k = 0; k < noteObject.points.length; k++) {
                                var pointObject = noteObject.points[k];
                                if (pointObject == undefined || pointObject.tick == undefined)
                                    continue;
                                var interval = (pointObject.pitchBend == undefined) ? 0 : (pointObject.pitchBend | 0);
                                var time = pointObject.tick | 0;
                                var volume = (pointObject.volume == undefined) ? 3 : Math.max(0, Math.min(3, Math.round((pointObject.volume | 0) * 3 / 100)));
                                if (time > this.beats * this.parts)
                                    continue;
                                if (tone.pins.length == 0) {
                                    if (time < toneClock)
                                        continue;
                                    tone.start = time;
                                    startInterval = interval;
                                }
                                else {
                                    if (time <= toneClock)
                                        continue;
                                }
                                toneClock = time;
                                tone.pins.push(new TonePin(interval - startInterval, time - tone.start, volume));
                            }
                            if (tone.pins.length < 2)
                                continue;
                            tone.end = tone.pins[tone.pins.length - 1].time + tone.start;
                            var maxPitch = channel == 3 ? Music.drumCount - 1 : Music.maxPitch;
                            var lowestPitch = maxPitch;
                            var highestPitch = 0;
                            for (var k = 0; k < tone.notes.length; k++) {
                                tone.notes[k] += startInterval;
                                if (tone.notes[k] < 0 || tone.notes[k] > maxPitch) {
                                    tone.notes.splice(k, 1);
                                    k--;
                                }
                                if (tone.notes[k] < lowestPitch)
                                    lowestPitch = tone.notes[k];
                                if (tone.notes[k] > highestPitch)
                                    highestPitch = tone.notes[k];
                            }
                            if (tone.notes.length < 1)
                                continue;
                            for (var k = 0; k < tone.pins.length; k++) {
                                var pin = tone.pins[k];
                                if (pin.interval + lowestPitch < 0)
                                    pin.interval = -lowestPitch;
                                if (pin.interval + highestPitch > maxPitch)
                                    pin.interval = maxPitch - highestPitch;
                                if (k >= 2) {
                                    if (pin.interval == tone.pins[k - 1].interval &&
                                        pin.interval == tone.pins[k - 2].interval &&
                                        pin.volume == tone.pins[k - 1].volume &&
                                        pin.volume == tone.pins[k - 2].volume) {
                                        tone.pins.splice(k - 1, 1);
                                        k--;
                                    }
                                }
                            }
                            pattern.tones.push(tone);
                            tickClock = tone.end;
                        }
                    }
                }
                for (var i = 0; i < this.bars; i++) {
                    this.channelBars[channel][i] = channelObject.sequence ? Math.min(this.patterns, channelObject.sequence[i] >>> 0) : 0;
                }
            }
        };
        Song.prototype._clip = function (min, max, val) {
            max = max - 1;
            if (val <= max) {
                if (val >= min)
                    return val;
                else
                    return min;
            }
            else {
                return max;
            }
        };
        Song.prototype.getPattern = function (channel, bar) {
            var patternIndex = this.channelBars[channel][bar];
            if (patternIndex == 0)
                return null;
            return this.channelPatterns[channel][patternIndex - 1];
        };
        Song.prototype.getPatternInstrument = function (channel, bar) {
            var pattern = this.getPattern(channel, bar);
            return pattern == null ? 0 : pattern.instrument;
        };
        Song.prototype.getBeatsPerMinute = function () {
            return Math.round(120.0 * Math.pow(2.0, (-4.0 + this.tempo) / 9.0));
        };
        return Song;
    }());
    Song._oldestVersion = 2;
    Song._latestVersion = 5;
    Song._base64CharToInt = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 20, l: 21, m: 22, n: 23, o: 24, p: 25, q: 26, r: 27, s: 28, t: 29, u: 30, v: 31, w: 32, x: 33, y: 34, z: 35, A: 36, B: 37, C: 38, D: 39, E: 40, F: 41, G: 42, H: 43, I: 44, J: 45, K: 46, L: 47, M: 48, N: 49, O: 50, P: 51, Q: 52, R: 53, S: 54, T: 55, U: 56, V: 57, W: 58, X: 59, Y: 60, Z: 61, "-": 62, ".": 62, _: 63 }; // 62 could be represented by either "-" or "." for historical reasons. New songs should use "-".
    Song._base64IntToChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", "_"];
    beepbox.Song = Song;
    var Synth = (function () {
        function Synth(song) {
            if (song === void 0) { song = null; }
            this.samplesPerSecond = 44100;
            this._effectDuration = 0.14;
            this._effectAngle = Math.PI * 2.0 / (this._effectDuration * this.samplesPerSecond);
            this._effectYMult = 2.0 * Math.cos(this._effectAngle);
            this._limitDecay = 1.0 / (2.0 * this.samplesPerSecond);
            this._waves = [
                new Float64Array([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 7.0 / 15.0, 9.0 / 15.0, 11.0 / 15.0, 13.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 13.0 / 15.0, 11.0 / 15.0, 9.0 / 15.0, 7.0 / 15.0, 5.0 / 15.0, 3.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -3.0 / 15.0, -5.0 / 15.0, -7.0 / 15.0, -9.0 / 15.0, -11.0 / 15.0, -13.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -13.0 / 15.0, -11.0 / 15.0, -9.0 / 15.0, -7.0 / 15.0, -5.0 / 15.0, -3.0 / 15.0, -1.0 / 15.0]),
                new Float64Array([1.0, -1.0]),
                new Float64Array([1.0, -1.0, -1.0, -1.0]),
                new Float64Array([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]),
                new Float64Array([1.0 / 31.0, 3.0 / 31.0, 5.0 / 31.0, 7.0 / 31.0, 9.0 / 31.0, 11.0 / 31.0, 13.0 / 31.0, 15.0 / 31.0, 17.0 / 31.0, 19.0 / 31.0, 21.0 / 31.0, 23.0 / 31.0, 25.0 / 31.0, 27.0 / 31.0, 29.0 / 31.0, 31.0 / 31.0, -31.0 / 31.0, -29.0 / 31.0, -27.0 / 31.0, -25.0 / 31.0, -23.0 / 31.0, -21.0 / 31.0, -19.0 / 31.0, -17.0 / 31.0, -15.0 / 31.0, -13.0 / 31.0, -11.0 / 31.0, -9.0 / 31.0, -7.0 / 31.0, -5.0 / 31.0, -3.0 / 31.0, -1.0 / 31.0]),
                new Float64Array([0.0, -0.2, -0.4, -0.6, -0.8, -1.0, 1.0, -0.8, -0.6, -0.4, -0.2, 1.0, 0.8, 0.6, 0.4, 0.2,]),
                new Float64Array([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0]),
                new Float64Array([1.0, -1.0, 1.0, -1.0, 1.0, 0.0]),
                new Float64Array([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6, -0.5, -0.4, -0.2,]),
            ];
            this._drumWaves = [new Float32Array(32767), new Float32Array(32767)];
            this.song = null;
            this.stutterPressed = false;
            this.pianoPressed = false;
            this.pianoNote = 0;
            this.pianoChannel = 0;
            this.enableIntro = true;
            this.enableOutro = false;
            this.loopCount = -1;
            this.volume = 1.0;
            this._playhead = 0.0;
            this._bar = 0;
            this._beat = 0;
            this._part = 0;
            this._arpeggio = 0;
            this._arpeggioSamples = 0;
            this._paused = true;
            this._leadPeriodA = 0.0;
            this._leadPeriodB = 0.0;
            this._leadSample = 0.0;
            this._harmonyPeriodA = 0.0;
            this._harmonyPeriodB = 0.0;
            this._harmonySample = 0.0;
            this._bassPeriodA = 0.0;
            this._bassPeriodB = 0.0;
            this._bassSample = 0.0;
            this._drumPeriod = 0.0;
            this._drumSample = 0.0;
            this._drumSignal = 1.0;
            this._stillGoing = false;
            //private sound: Sound = new Sound();
            //private soundChannel: SoundChannel = null;
            //private timer: Timer = new Timer(200, 0);
            this._effectPeriod = 0.0;
            this._limit = 0.0;
            this._delayLine = new Float32Array(16384);
            this._delayPos = 0;
            this._delayFeedback0 = 0.0;
            this._delayFeedback1 = 0.0;
            this._delayFeedback2 = 0.0;
            this._delayFeedback3 = 0.0;
            for (var _i = 0, _a = this._waves; _i < _a.length; _i++) {
                var wave = _a[_i];
                //wave.fixed = true;
                var sum = 0.0;
                for (var i = 0; i < wave.length; i++)
                    sum += wave[i];
                var average = sum / wave.length;
                for (var i = 0; i < wave.length; i++)
                    wave[i] -= average;
            }
            for (var index = 0; index < this._drumWaves.length; index++) {
                var wave = this._drumWaves[index];
                if (index == 0) {
                    var drumBuffer = 1;
                    for (var i = 0; i < 32767; i++) {
                        wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                        var newBuffer = drumBuffer >> 1;
                        if (((drumBuffer + newBuffer) & 1) == 1) {
                            newBuffer += 1 << 14;
                        }
                        drumBuffer = newBuffer;
                    }
                }
                else if (index == 1) {
                    for (var i = 0; i < 32767; i++) {
                        wave[i] = Math.random() * 2.0 - 1.0;
                    }
                }
            }
            if (song != null) {
                this.setSong(song);
            }
        }
        Object.defineProperty(Synth.prototype, "playing", {
            get: function () {
                return !this._paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Synth.prototype, "playhead", {
            get: function () {
                return this._playhead;
            },
            set: function (value) {
                if (this.song != null) {
                    this._playhead = Math.max(0, Math.min(this.song.bars, value));
                    var remainder = this._playhead;
                    this._bar = Math.floor(remainder);
                    remainder = this.song.beats * (remainder - this._bar);
                    this._beat = Math.floor(remainder);
                    remainder = this.song.parts * (remainder - this._beat);
                    this._part = Math.floor(remainder);
                    remainder = 4 * (remainder - this._part);
                    this._arpeggio = Math.floor(remainder);
                    var samplesPerArpeggio = this._getSamplesPerArpeggio();
                    remainder = samplesPerArpeggio * (remainder - this._arpeggio);
                    this._arpeggioSamples = Math.floor(samplesPerArpeggio - remainder);
                    if (this._bar < this.song.loopStart) {
                        this.enableIntro = true;
                    }
                    if (this._bar > this.song.loopStart + this.song.loopLength) {
                        this.enableOutro = true;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Synth.prototype, "totalSamples", {
            get: function () {
                if (this.song == null)
                    return 0;
                var samplesPerBar = this._getSamplesPerArpeggio() * 4 * this.song.parts * this.song.beats;
                var loopMinCount = this.loopCount;
                if (loopMinCount < 0)
                    loopMinCount = 1;
                var bars = this.song.loopLength * loopMinCount;
                if (this.enableIntro)
                    bars += this.song.loopStart;
                if (this.enableOutro)
                    bars += this.song.bars - (this.song.loopStart + this.song.loopLength);
                return bars * samplesPerBar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Synth.prototype, "totalSeconds", {
            get: function () {
                return this.totalSamples / this.samplesPerSecond;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Synth.prototype, "totalBars", {
            get: function () {
                if (this.song == null)
                    return 0.0;
                return this.song.bars;
            },
            enumerable: true,
            configurable: true
        });
        Synth.prototype.setSong = function (song) {
            if (typeof (song) == "string") {
                this.song = new Song(song);
            }
            else if (song instanceof Song) {
                this.song = song;
            }
        };
        Synth.prototype.play = function () {
            if (!this._paused)
                return;
            this._paused = false;
            var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
            this._audioCtx = this._audioCtx || new contextClass();
            this._scriptNode = this._audioCtx.createScriptProcessor ? this._audioCtx.createScriptProcessor(2048, 0, 1) : this._audioCtx.createJavaScriptNode(2048, 0, 1); // 2048, 0 input channels, 1 output
            this._scriptNode.onaudioprocess = this._onSampleData.bind(this);
            this._scriptNode.channelCountMode = 'explicit';
            this._scriptNode.channelInterpretation = 'speakers';
            this._scriptNode.connect(this._audioCtx.destination);
            this.samplesPerSecond = this._audioCtx.sampleRate;
            this._effectAngle = Math.PI * 2.0 / (this._effectDuration * this.samplesPerSecond);
            this._effectYMult = 2.0 * Math.cos(this._effectAngle);
            this._limitDecay = 1.0 / (2.0 * this.samplesPerSecond);
        };
        Synth.prototype.pause = function () {
            if (this._paused)
                return;
            this._paused = true;
            this._scriptNode.disconnect(this._audioCtx.destination);
            if (this._audioCtx.close) {
                this._audioCtx.close(); // firefox is missing this function?
                this._audioCtx = null;
            }
            this._scriptNode = null;
        };
        Synth.prototype.snapToStart = function () {
            this._bar = 0;
            this.enableIntro = true;
            this.snapToBar();
        };
        Synth.prototype.snapToBar = function () {
            this._playhead = this._bar;
            this._beat = 0;
            this._part = 0;
            this._arpeggio = 0;
            this._arpeggioSamples = 0;
            this._effectPeriod = 0.0;
            this._leadSample = 0.0;
            this._harmonySample = 0.0;
            this._bassSample = 0.0;
            this._drumSample = 0.0;
            this._delayPos = 0;
            this._delayFeedback0 = 0.0;
            this._delayFeedback1 = 0.0;
            this._delayFeedback2 = 0.0;
            this._delayFeedback3 = 0.0;
            for (var i = 0; i < this._delayLine.length; i++)
                this._delayLine[i] = 0.0;
        };
        Synth.prototype.nextBar = function () {
            var oldBar = this._bar;
            this._bar++;
            if (this.enableOutro) {
                if (this._bar >= this.song.bars) {
                    this._bar = this.enableIntro ? 0 : this.song.loopStart;
                }
            }
            else {
                if (this._bar >= this.song.loopStart + this.song.loopLength || this._bar >= this.song.bars) {
                    this._bar = this.song.loopStart;
                }
            }
            this._playhead += this._bar - oldBar;
        };
        Synth.prototype.prevBar = function () {
            var oldBar = this._bar;
            this._bar--;
            if (this._bar < 0) {
                this._bar = this.song.loopStart + this.song.loopLength - 1;
            }
            if (this._bar >= this.song.bars) {
                this._bar = this.song.bars - 1;
            }
            if (this._bar < this.song.loopStart) {
                this.enableIntro = true;
            }
            if (!this.enableOutro && this._bar >= this.song.loopStart + this.song.loopLength) {
                this._bar = this.song.loopStart + this.song.loopLength - 1;
            }
            this._playhead += this._bar - oldBar;
        };
        Synth.prototype._onSampleData = function (audioProcessingEvent) {
            var outputBuffer = audioProcessingEvent.outputBuffer;
            var outputData = outputBuffer.getChannelData(0);
            this.synthesize(outputData, outputBuffer.length);
        };
        Synth.prototype.synthesize = function (data, totalSamples) {
            var _this = this;
            if (this.song == null) {
                for (var i = 0; i < totalSamples; i++) {
                    data[i] = 0.0;
                }
                return;
            }
            var bufferIndex = 0;
            var stutterFunction;
            if (this.stutterPressed) {
                var barOld_1 = this._bar;
                var beatOld_1 = this._beat;
                var partOld_1 = this._part;
                var arpeggioOld_1 = this._arpeggio;
                var arpeggioSamplesOld_1 = this._arpeggioSamples;
                var leadPeriodAOld_1 = this._leadPeriodA;
                var leadPeriodBOld_1 = this._leadPeriodB;
                var leadSampleOld_1 = this._leadSample;
                var harmonyPeriodAOld_1 = this._harmonyPeriodA;
                var harmonyPeriodBOld_1 = this._harmonyPeriodB;
                var harmonySampleOld_1 = this._harmonySample;
                var bassPeriodAOld_1 = this._bassPeriodA;
                var bassPeriodBOld_1 = this._bassPeriodB;
                var bassSampleOld_1 = this._bassSample;
                var drumPeriodOld_1 = this._drumPeriod;
                var drumSampleOld_1 = this._drumSample;
                var drumSignalOld_1 = this._drumSignal;
                var effectPeriodOld_1 = this._effectPeriod;
                var limitOld_1 = this._limit;
                stutterFunction = function () {
                    _this._bar = barOld_1;
                    _this._beat = beatOld_1;
                    _this._part = partOld_1;
                    _this._arpeggio = arpeggioOld_1;
                    _this._arpeggioSamples = arpeggioSamplesOld_1;
                    _this._leadPeriodA = leadPeriodAOld_1;
                    _this._leadPeriodB = leadPeriodBOld_1;
                    _this._leadSample = leadSampleOld_1;
                    _this._harmonyPeriodA = harmonyPeriodAOld_1;
                    _this._harmonyPeriodB = harmonyPeriodBOld_1;
                    _this._harmonySample = harmonySampleOld_1;
                    _this._bassPeriodA = bassPeriodAOld_1;
                    _this._bassPeriodB = bassPeriodBOld_1;
                    _this._bassSample = bassSampleOld_1;
                    _this._drumPeriod = drumPeriodOld_1;
                    _this._drumSample = drumSampleOld_1;
                    _this._drumSignal = drumSignalOld_1;
                    _this._effectPeriod = effectPeriodOld_1;
                    _this._limit = limitOld_1;
                };
            }
            var sampleTime = 1.0 / this.samplesPerSecond;
            var samplesPerArpeggio = this._getSamplesPerArpeggio();
            var effectYMult = this._effectYMult;
            var limitDecay = this._limitDecay;
            var volume = this.volume;
            var delayLine = this._delayLine;
            var reverb = Math.pow(this.song.reverb / Music.reverbRange, 0.667) * 0.425;
            var ended = false;
            // Check the bounds of the playhead:
            if (this._arpeggioSamples == 0 || this._arpeggioSamples > samplesPerArpeggio) {
                this._arpeggioSamples = samplesPerArpeggio;
            }
            if (this._part >= this.song.parts) {
                this._beat++;
                this._part = 0;
                this._arpeggio = 0;
                this._arpeggioSamples = samplesPerArpeggio;
            }
            if (this._beat >= this.song.beats) {
                this._bar++;
                this._beat = 0;
                this._part = 0;
                this._arpeggio = 0;
                this._arpeggioSamples = samplesPerArpeggio;
                if (this.loopCount == -1) {
                    if (this._bar < this.song.loopStart && !this.enableIntro)
                        this._bar = this.song.loopStart;
                    if (this._bar >= this.song.loopStart + this.song.loopLength && !this.enableOutro)
                        this._bar = this.song.loopStart;
                }
            }
            if (this._bar >= this.song.bars) {
                if (this.enableOutro) {
                    this._bar = 0;
                    this.enableIntro = true;
                    ended = true;
                    this.pause();
                }
                else {
                    this._bar = this.song.loopStart;
                }
            }
            if (this._bar >= this.song.loopStart) {
                this.enableIntro = false;
            }
            var maxLeadVolume;
            var maxHarmVolume;
            var maxBassVolume;
            var maxDrumVolume;
            var leadWave;
            var harmWave;
            var bassWave;
            var drumWave;
            var leadWaveLength;
            var harmWaveLength;
            var bassWaveLength;
            var leadFilterBase;
            var harmFilterBase;
            var bassFilterBase;
            var drumFilter;
            var leadTremeloScale;
            var harmTremeloScale;
            var bassTremeloScale;
            var leadChorusA;
            var harmChorusA;
            var bassChorusA;
            var leadChorusB;
            var harmChorusB;
            var bassChorusB;
            var leadChorusSign;
            var harmChorusSign;
            var bassChorusSign;
            var updateInstruments = function () {
                var instrumentLead = _this.song.getPatternInstrument(0, _this._bar);
                var instrumentHarm = _this.song.getPatternInstrument(1, _this._bar);
                var instrumentBass = _this.song.getPatternInstrument(2, _this._bar);
                var instrumentDrum = _this.song.getPatternInstrument(3, _this._bar);
                maxLeadVolume = Music.channelVolumes[0] * (_this.song.instrumentVolumes[0][instrumentLead] == 5 ? 0.0 : Math.pow(2, -Music.volumeValues[_this.song.instrumentVolumes[0][instrumentLead]])) * Music.waveVolumes[_this.song.instrumentWaves[0][instrumentLead]] * Music.filterVolumes[_this.song.instrumentFilters[0][instrumentLead]] * Music.chorusVolumes[_this.song.instrumentChorus[0][instrumentLead]] * 0.5;
                maxHarmVolume = Music.channelVolumes[1] * (_this.song.instrumentVolumes[1][instrumentHarm] == 5 ? 0.0 : Math.pow(2, -Music.volumeValues[_this.song.instrumentVolumes[1][instrumentHarm]])) * Music.waveVolumes[_this.song.instrumentWaves[1][instrumentHarm]] * Music.filterVolumes[_this.song.instrumentFilters[1][instrumentHarm]] * Music.chorusVolumes[_this.song.instrumentChorus[0][instrumentHarm]] * 0.5;
                maxBassVolume = Music.channelVolumes[2] * (_this.song.instrumentVolumes[2][instrumentBass] == 5 ? 0.0 : Math.pow(2, -Music.volumeValues[_this.song.instrumentVolumes[2][instrumentBass]])) * Music.waveVolumes[_this.song.instrumentWaves[2][instrumentBass]] * Music.filterVolumes[_this.song.instrumentFilters[2][instrumentBass]] * Music.chorusVolumes[_this.song.instrumentChorus[0][instrumentBass]] * 0.5;
                maxDrumVolume = Music.channelVolumes[3] * (_this.song.instrumentVolumes[3][instrumentDrum] == 5 ? 0.0 : Math.pow(2, -Music.volumeValues[_this.song.instrumentVolumes[3][instrumentDrum]])) * Music.drumVolumes[_this.song.instrumentWaves[3][instrumentDrum]];
                leadWave = _this._waves[_this.song.instrumentWaves[0][instrumentLead]];
                harmWave = _this._waves[_this.song.instrumentWaves[1][instrumentHarm]];
                bassWave = _this._waves[_this.song.instrumentWaves[2][instrumentBass]];
                drumWave = _this._drumWaves[_this.song.instrumentWaves[3][instrumentDrum]];
                leadWaveLength = leadWave.length;
                harmWaveLength = harmWave.length;
                bassWaveLength = bassWave.length;
                leadFilterBase = Math.pow(2, -Music.filterBases[_this.song.instrumentFilters[0][instrumentLead]]);
                harmFilterBase = Math.pow(2, -Music.filterBases[_this.song.instrumentFilters[1][instrumentHarm]]);
                bassFilterBase = Math.pow(2, -Music.filterBases[_this.song.instrumentFilters[2][instrumentBass]]);
                drumFilter = 1.0;
                leadTremeloScale = Music.effectTremelos[_this.song.instrumentEffects[0][instrumentLead]];
                harmTremeloScale = Music.effectTremelos[_this.song.instrumentEffects[1][instrumentHarm]];
                bassTremeloScale = Music.effectTremelos[_this.song.instrumentEffects[2][instrumentBass]];
                leadChorusA = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[0][instrumentLead]] + Music.chorusValues[_this.song.instrumentChorus[0][instrumentLead]]) / 12.0);
                harmChorusA = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[1][instrumentHarm]] + Music.chorusValues[_this.song.instrumentChorus[1][instrumentHarm]]) / 12.0);
                bassChorusA = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[2][instrumentBass]] + Music.chorusValues[_this.song.instrumentChorus[2][instrumentBass]]) / 12.0);
                leadChorusB = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[0][instrumentLead]] - Music.chorusValues[_this.song.instrumentChorus[0][instrumentLead]]) / 12.0);
                harmChorusB = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[1][instrumentHarm]] - Music.chorusValues[_this.song.instrumentChorus[1][instrumentHarm]]) / 12.0);
                bassChorusB = Math.pow(2.0, (Music.chorusOffsets[_this.song.instrumentChorus[2][instrumentBass]] - Music.chorusValues[_this.song.instrumentChorus[2][instrumentBass]]) / 12.0);
                leadChorusSign = (_this.song.instrumentChorus[0][instrumentLead] == 7) ? -1.0 : 1.0;
                harmChorusSign = (_this.song.instrumentChorus[1][instrumentHarm] == 7) ? -1.0 : 1.0;
                bassChorusSign = (_this.song.instrumentChorus[2][instrumentBass] == 7) ? -1.0 : 1.0;
                if (_this.song.instrumentChorus[0][instrumentLead] == 0)
                    _this._leadPeriodB = _this._leadPeriodA;
                if (_this.song.instrumentChorus[1][instrumentHarm] == 0)
                    _this._harmonyPeriodB = _this._harmonyPeriodA;
                if (_this.song.instrumentChorus[2][instrumentBass] == 0)
                    _this._bassPeriodB = _this._bassPeriodA;
            };
            updateInstruments();
            while (totalSamples > 0) {
                if (ended) {
                    console.log("ended");
                    while (totalSamples-- > 0) {
                        data[bufferIndex] = 0.0;
                        bufferIndex++;
                    }
                    break;
                }
                var samples = void 0;
                if (this._arpeggioSamples <= totalSamples) {
                    samples = this._arpeggioSamples;
                }
                else {
                    samples = totalSamples;
                }
                totalSamples -= samples;
                this._arpeggioSamples -= samples;
                ///@TODO: If I use "let" for these, Typescript inserts inline functions in place of while loops when transpiling?
                var leadPeriodDelta;
                var leadPeriodDeltaScale;
                var leadVolume;
                var leadVolumeDelta;
                var leadFilter;
                var leadFilterScale;
                var leadVibratoScale;
                var harmPeriodDelta;
                var harmPeriodDeltaScale;
                var harmVolume;
                var harmVolumeDelta;
                var harmFilter;
                var harmFilterScale;
                var harmVibratoScale;
                var bassPeriodDelta;
                var bassPeriodDeltaScale;
                var bassVolume;
                var bassVolumeDelta;
                var bassFilter;
                var bassFilterScale;
                var bassVibratoScale;
                var drumPeriodDelta;
                var drumPeriodDeltaScale;
                var drumVolume;
                var drumVolumeDelta;
                var time = this._part + this._beat * this.song.parts;
                for (var channel = 0; channel < 4; channel++) {
                    var pattern = this.song.getPattern(channel, this._bar);
                    var attack = pattern == null ? 0 : this.song.instrumentAttacks[channel][pattern.instrument];
                    var tone = null;
                    var prevTone = null;
                    var nextTone = null;
                    if (pattern != null) {
                        for (var i = 0; i < pattern.tones.length; i++) {
                            if (pattern.tones[i].end <= time) {
                                prevTone = pattern.tones[i];
                            }
                            else if (pattern.tones[i].start <= time && pattern.tones[i].end > time) {
                                tone = pattern.tones[i];
                            }
                            else if (pattern.tones[i].start > time) {
                                nextTone = pattern.tones[i];
                                break;
                            }
                        }
                    }
                    if (tone != null && prevTone != null && prevTone.end != tone.start)
                        prevTone = null;
                    if (tone != null && nextTone != null && nextTone.start != tone.end)
                        nextTone = null;
                    var channelRoot = channel == 3 ? 69 : Music.keyTransposes[this.song.key];
                    var intervalScale = channel == 3 ? Music.drumInterval : 1;
                    var periodDelta = void 0;
                    var periodDeltaScale = void 0;
                    var toneVolume = void 0;
                    var volumeDelta = void 0;
                    var filter = void 0;
                    var filterScale = void 0;
                    var vibratoScale = void 0;
                    var resetPeriod = false;
                    if (this.pianoPressed && channel == this.pianoChannel) {
                        var pianoFreq = this._frequencyFromPitch(channelRoot + this.pianoNote * intervalScale);
                        var pianoPitchDamping = void 0;
                        if (channel == 3) {
                            if (this.song.instrumentWaves[3][pattern.instrument] > 0) {
                                drumFilter = Math.min(1.0, pianoFreq * sampleTime * 8.0);
                                pianoPitchDamping = 24.0;
                            }
                            else {
                                pianoPitchDamping = 60.0;
                            }
                        }
                        else {
                            pianoPitchDamping = 48.0;
                        }
                        periodDelta = pianoFreq * sampleTime;
                        periodDeltaScale = 1.0;
                        toneVolume = Math.pow(2.0, -this.pianoNote * intervalScale / pianoPitchDamping);
                        volumeDelta = 0.0;
                        filter = 1.0;
                        filterScale = 1.0;
                        vibratoScale = Math.pow(2.0, Music.effectVibratos[this.song.instrumentEffects[channel][pattern.instrument]] / 12.0) - 1.0;
                    }
                    else if (tone == null) {
                        periodDelta = 0.0;
                        periodDeltaScale = 0.0;
                        toneVolume = 0.0;
                        volumeDelta = 0.0;
                        filter = 1.0;
                        filterScale = 1.0;
                        vibratoScale = 0.0;
                        resetPeriod = true;
                    }
                    else {
                        var pitch = void 0;
                        if (tone.notes.length == 2) {
                            pitch = tone.notes[this._arpeggio >> 1];
                        }
                        else if (tone.notes.length == 3) {
                            pitch = tone.notes[this._arpeggio == 3 ? 1 : this._arpeggio];
                        }
                        else if (tone.notes.length == 4) {
                            pitch = tone.notes[this._arpeggio];
                        }
                        else {
                            pitch = tone.notes[0];
                        }
                        var startPin = null;
                        var endPin = null;
                        for (var _i = 0, _a = tone.pins; _i < _a.length; _i++) {
                            var pin = _a[_i];
                            if (pin.time + tone.start <= time) {
                                startPin = pin;
                            }
                            else {
                                endPin = pin;
                                break;
                            }
                        }
                        var toneStart = tone.start * 4;
                        var toneEnd = tone.end * 4;
                        var pinStart = (tone.start + startPin.time) * 4;
                        var pinEnd = (tone.start + endPin.time) * 4;
                        var arpeggioStart = time * 4 + this._arpeggio;
                        var arpeggioEnd = time * 4 + this._arpeggio + 1;
                        var arpeggioRatioStart = (arpeggioStart - pinStart) / (pinEnd - pinStart);
                        var arpeggioRatioEnd = (arpeggioEnd - pinStart) / (pinEnd - pinStart);
                        var arpeggioVolumeStart = startPin.volume * (1.0 - arpeggioRatioStart) + endPin.volume * arpeggioRatioStart;
                        var arpeggioVolumeEnd = startPin.volume * (1.0 - arpeggioRatioEnd) + endPin.volume * arpeggioRatioEnd;
                        var arpeggioIntervalStart = startPin.interval * (1.0 - arpeggioRatioStart) + endPin.interval * arpeggioRatioStart;
                        var arpeggioIntervalEnd = startPin.interval * (1.0 - arpeggioRatioEnd) + endPin.interval * arpeggioRatioEnd;
                        var arpeggioFilterTimeStart = startPin.time * (1.0 - arpeggioRatioStart) + endPin.time * arpeggioRatioStart;
                        var arpeggioFilterTimeEnd = startPin.time * (1.0 - arpeggioRatioEnd) + endPin.time * arpeggioRatioEnd;
                        var inhibitRestart = false;
                        if (arpeggioStart == toneStart) {
                            if (attack == 0) {
                                inhibitRestart = true;
                            }
                            else if (attack == 2) {
                                arpeggioVolumeStart = 0.0;
                            }
                            else if (attack == 3) {
                                if (prevTone == null || prevTone.notes.length > 1 || tone.notes.length > 1) {
                                    arpeggioVolumeStart = 0.0;
                                }
                                else if (prevTone.pins[prevTone.pins.length - 1].volume == 0 || tone.pins[0].volume == 0) {
                                    arpeggioVolumeStart = 0.0;
                                }
                                else {
                                    arpeggioIntervalStart = (prevTone.notes[0] + prevTone.pins[prevTone.pins.length - 1].interval - pitch) * 0.5;
                                    arpeggioFilterTimeStart = prevTone.pins[prevTone.pins.length - 1].time * 0.5;
                                    inhibitRestart = true;
                                }
                            }
                        }
                        if (arpeggioEnd == toneEnd) {
                            if (attack == 1 || attack == 2) {
                                arpeggioVolumeEnd = 0.0;
                            }
                            else if (attack == 3) {
                                if (nextTone == null || nextTone.notes.length > 1 || tone.notes.length > 1) {
                                    arpeggioVolumeEnd = 0.0;
                                }
                                else if (tone.pins[tone.pins.length - 1].volume == 0 || nextTone.pins[0].volume == 0) {
                                    arpeggioVolumeStart = 0.0;
                                }
                                else {
                                    arpeggioIntervalEnd = (nextTone.notes[0] + tone.pins[tone.pins.length - 1].interval - pitch) * 0.5;
                                    arpeggioFilterTimeEnd *= 0.5;
                                }
                            }
                        }
                        var startRatio = 1.0 - (this._arpeggioSamples + samples) / samplesPerArpeggio;
                        var endRatio = 1.0 - (this._arpeggioSamples) / samplesPerArpeggio;
                        var startInterval = arpeggioIntervalStart * (1.0 - startRatio) + arpeggioIntervalEnd * startRatio;
                        var endInterval = arpeggioIntervalStart * (1.0 - endRatio) + arpeggioIntervalEnd * endRatio;
                        var startFilterTime = arpeggioFilterTimeStart * (1.0 - startRatio) + arpeggioFilterTimeEnd * startRatio;
                        var endFilterTime = arpeggioFilterTimeStart * (1.0 - endRatio) + arpeggioFilterTimeEnd * endRatio;
                        var startFreq = this._frequencyFromPitch(channelRoot + (pitch + startInterval) * intervalScale);
                        var endFreq = this._frequencyFromPitch(channelRoot + (pitch + endInterval) * intervalScale);
                        var pitchDamping = void 0;
                        if (channel == 3) {
                            if (this.song.instrumentWaves[3][pattern.instrument] > 0) {
                                drumFilter = Math.min(1.0, startFreq * sampleTime * 8.0);
                                //console.log(drumFilter);
                                pitchDamping = 24.0;
                            }
                            else {
                                pitchDamping = 60.0;
                            }
                        }
                        else {
                            pitchDamping = 48.0;
                        }
                        var startVol = Math.pow(2.0, -(pitch + startInterval) * intervalScale / pitchDamping);
                        var endVol = Math.pow(2.0, -(pitch + endInterval) * intervalScale / pitchDamping);
                        startVol *= this._volumeConversion(arpeggioVolumeStart * (1.0 - startRatio) + arpeggioVolumeEnd * startRatio);
                        endVol *= this._volumeConversion(arpeggioVolumeStart * (1.0 - endRatio) + arpeggioVolumeEnd * endRatio);
                        var freqScale = endFreq / startFreq;
                        periodDelta = startFreq * sampleTime;
                        periodDeltaScale = Math.pow(freqScale, 1.0 / samples);
                        toneVolume = startVol;
                        volumeDelta = (endVol - startVol) / samples;
                        var timeSinceStart = (arpeggioStart + startRatio - toneStart) * samplesPerArpeggio / this.samplesPerSecond;
                        if (timeSinceStart == 0.0 && !inhibitRestart)
                            resetPeriod = true;
                        var filterScaleRate = Music.filterDecays[this.song.instrumentFilters[channel][pattern.instrument]];
                        filter = Math.pow(2, -filterScaleRate * startFilterTime * 4.0 * samplesPerArpeggio / this.samplesPerSecond);
                        var endFilter = Math.pow(2, -filterScaleRate * endFilterTime * 4.0 * samplesPerArpeggio / this.samplesPerSecond);
                        filterScale = Math.pow(endFilter / filter, 1.0 / samples);
                        vibratoScale = (this.song.instrumentEffects[channel][pattern.instrument] == 2 && time - tone.start < 3) ? 0.0 : Math.pow(2.0, Music.effectVibratos[this.song.instrumentEffects[channel][pattern.instrument]] / 12.0) - 1.0;
                    }
                    if (channel == 0) {
                        leadPeriodDelta = periodDelta;
                        leadPeriodDeltaScale = periodDeltaScale;
                        leadVolume = toneVolume * maxLeadVolume;
                        leadVolumeDelta = volumeDelta * maxLeadVolume;
                        leadFilter = filter * leadFilterBase;
                        leadFilterScale = filterScale;
                        leadVibratoScale = vibratoScale;
                        if (resetPeriod) {
                            this._leadSample = 0.0;
                            this._leadPeriodA = 0.0;
                            this._leadPeriodB = 0.0;
                        }
                    }
                    else if (channel == 1) {
                        harmPeriodDelta = periodDelta;
                        harmPeriodDeltaScale = periodDeltaScale;
                        harmVolume = toneVolume * maxHarmVolume;
                        harmVolumeDelta = volumeDelta * maxHarmVolume;
                        harmFilter = filter * harmFilterBase;
                        harmFilterScale = filterScale;
                        harmVibratoScale = vibratoScale;
                        if (resetPeriod) {
                            this._harmonySample = 0.0;
                            this._harmonyPeriodA = 0.0;
                            this._harmonyPeriodB = 0.0;
                        }
                    }
                    else if (channel == 2) {
                        bassPeriodDelta = periodDelta;
                        bassPeriodDeltaScale = periodDeltaScale;
                        bassVolume = toneVolume * maxBassVolume;
                        bassVolumeDelta = volumeDelta * maxBassVolume;
                        bassFilter = filter * bassFilterBase;
                        bassFilterScale = filterScale;
                        bassVibratoScale = vibratoScale;
                        if (resetPeriod) {
                            this._bassSample = 0.0;
                            this._bassPeriodA = 0.0;
                            this._bassPeriodB = 0.0;
                        }
                    }
                    else if (channel == 3) {
                        drumPeriodDelta = periodDelta / 32767.0;
                        drumPeriodDeltaScale = periodDeltaScale;
                        drumVolume = toneVolume * maxDrumVolume;
                        drumVolumeDelta = volumeDelta * maxDrumVolume;
                    }
                }
                var effectY = Math.sin(this._effectPeriod);
                var prevEffectY = Math.sin(this._effectPeriod - this._effectAngle);
                var leadSample = +this._leadSample;
                var leadPeriodA = +this._leadPeriodA;
                var leadPeriodB = +this._leadPeriodB;
                var harmSample = +this._harmonySample;
                var harmPeriodA = +this._harmonyPeriodA;
                var harmPeriodB = +this._harmonyPeriodB;
                var bassSample = +this._bassSample;
                var bassPeriodA = +this._bassPeriodA;
                var bassPeriodB = +this._bassPeriodB;
                var drumSample = +this._drumSample;
                var drumPeriod = +this._drumPeriod;
                var delayPos = 0 | this._delayPos;
                var delayFeedback0 = +this._delayFeedback0;
                var delayFeedback1 = +this._delayFeedback1;
                var delayFeedback2 = +this._delayFeedback2;
                var delayFeedback3 = +this._delayFeedback3;
                var limit = +this._limit;
                while (samples) {
                    var leadVibrato = 1.0 + leadVibratoScale * effectY;
                    var harmVibrato = 1.0 + harmVibratoScale * effectY;
                    var bassVibrato = 1.0 + bassVibratoScale * effectY;
                    var leadTremelo = 1.0 + leadTremeloScale * (effectY - 1.0);
                    var harmTremelo = 1.0 + harmTremeloScale * (effectY - 1.0);
                    var bassTremelo = 1.0 + bassTremeloScale * (effectY - 1.0);
                    var temp = effectY;
                    effectY = effectYMult * effectY - prevEffectY;
                    prevEffectY = temp;
                    leadSample += ((leadWave[0 | (leadPeriodA * leadWaveLength)] + leadWave[0 | (leadPeriodB * leadWaveLength)] * leadChorusSign) * leadVolume * leadTremelo - leadSample) * leadFilter;
                    harmSample += ((harmWave[0 | (harmPeriodA * harmWaveLength)] + harmWave[0 | (harmPeriodB * harmWaveLength)] * harmChorusSign) * harmVolume * harmTremelo - harmSample) * harmFilter;
                    bassSample += ((bassWave[0 | (bassPeriodA * bassWaveLength)] + bassWave[0 | (bassPeriodB * bassWaveLength)] * bassChorusSign) * bassVolume * bassTremelo - bassSample) * bassFilter;
                    drumSample += (drumWave[0 | (drumPeriod * 32767.0)] * drumVolume - drumSample) * drumFilter;
                    leadVolume += leadVolumeDelta;
                    harmVolume += harmVolumeDelta;
                    bassVolume += bassVolumeDelta;
                    drumVolume += drumVolumeDelta;
                    leadPeriodA += leadPeriodDelta * leadVibrato * leadChorusA;
                    leadPeriodB += leadPeriodDelta * leadVibrato * leadChorusB;
                    harmPeriodA += harmPeriodDelta * harmVibrato * harmChorusA;
                    harmPeriodB += harmPeriodDelta * harmVibrato * harmChorusB;
                    bassPeriodA += bassPeriodDelta * bassVibrato * bassChorusA;
                    bassPeriodB += bassPeriodDelta * bassVibrato * bassChorusB;
                    drumPeriod += drumPeriodDelta;
                    leadPeriodDelta *= leadPeriodDeltaScale;
                    harmPeriodDelta *= harmPeriodDeltaScale;
                    bassPeriodDelta *= bassPeriodDeltaScale;
                    drumPeriodDelta *= drumPeriodDeltaScale;
                    leadFilter *= leadFilterScale;
                    harmFilter *= harmFilterScale;
                    bassFilter *= bassFilterScale;
                    leadPeriodA -= 0 | leadPeriodA;
                    leadPeriodB -= 0 | leadPeriodB;
                    harmPeriodA -= 0 | harmPeriodA;
                    harmPeriodB -= 0 | harmPeriodB;
                    bassPeriodA -= 0 | bassPeriodA;
                    bassPeriodB -= 0 | bassPeriodB;
                    drumPeriod -= 0 | drumPeriod;
                    var instrumentSample = leadSample + harmSample + bassSample;
                    // Reverb, implemented using a feedback delay network with a Hadamard matrix and lowpass filters.
                    // good ratios:    0.555235 + 0.618033 + 0.818 +   1.0 = 2.991268
                    // Delay lengths:  3041     + 3385     + 4481  +  5477 = 16384 = 2^14
                    // Buffer offsets: 3041    -> 6426   -> 10907 -> 16384
                    var delaySample0 = delayLine[delayPos] + instrumentSample;
                    var delaySample1 = delayLine[(delayPos + 3041) & 0x3FFF];
                    var delaySample2 = delayLine[(delayPos + 6426) & 0x3FFF];
                    var delaySample3 = delayLine[(delayPos + 10907) & 0x3FFF];
                    var delayTemp0 = -delaySample0 + delaySample1;
                    var delayTemp1 = -delaySample0 - delaySample1;
                    var delayTemp2 = -delaySample2 + delaySample3;
                    var delayTemp3 = -delaySample2 - delaySample3;
                    delayFeedback0 += ((delayTemp0 + delayTemp2) * reverb - delayFeedback0) * 0.5;
                    delayFeedback1 += ((delayTemp1 + delayTemp3) * reverb - delayFeedback1) * 0.5;
                    delayFeedback2 += ((delayTemp0 - delayTemp2) * reverb - delayFeedback2) * 0.5;
                    delayFeedback3 += ((delayTemp1 - delayTemp3) * reverb - delayFeedback3) * 0.5;
                    delayLine[(delayPos + 3041) & 0x3FFF] = delayFeedback0;
                    delayLine[(delayPos + 6426) & 0x3FFF] = delayFeedback1;
                    delayLine[(delayPos + 10907) & 0x3FFF] = delayFeedback2;
                    delayLine[delayPos] = delayFeedback3;
                    delayPos = (delayPos + 1) & 0x3FFF;
                    var sample = delaySample0 + delaySample1 + delaySample2 + delaySample3 + drumSample;
                    var abs = sample < 0.0 ? -sample : sample;
                    limit -= limitDecay;
                    if (limit < abs)
                        limit = abs;
                    sample /= limit * 0.75 + 0.25;
                    sample *= volume;
                    data[bufferIndex] = sample;
                    bufferIndex = bufferIndex + 1;
                    samples--;
                }
                this._leadSample = leadSample;
                this._leadPeriodA = leadPeriodA;
                this._leadPeriodB = leadPeriodB;
                this._harmonySample = harmSample;
                this._harmonyPeriodA = harmPeriodA;
                this._harmonyPeriodB = harmPeriodB;
                this._bassSample = bassSample;
                this._bassPeriodA = bassPeriodA;
                this._bassPeriodB = bassPeriodB;
                this._drumSample = drumSample;
                this._drumPeriod = drumPeriod;
                this._delayPos = delayPos;
                this._delayFeedback0 = delayFeedback0;
                this._delayFeedback1 = delayFeedback1;
                this._delayFeedback2 = delayFeedback2;
                this._delayFeedback3 = delayFeedback3;
                this._limit = limit;
                if (effectYMult * effectY - prevEffectY > prevEffectY) {
                    this._effectPeriod = Math.asin(effectY);
                }
                else {
                    this._effectPeriod = Math.PI - Math.asin(effectY);
                }
                if (this._arpeggioSamples == 0) {
                    this._arpeggio++;
                    this._arpeggioSamples = samplesPerArpeggio;
                    if (this._arpeggio == 4) {
                        this._arpeggio = 0;
                        this._part++;
                        if (this._part == this.song.parts) {
                            this._part = 0;
                            this._beat++;
                            if (this._beat == this.song.beats) {
                                this._beat = 0;
                                this._effectPeriod = 0.0;
                                this._bar++;
                                if (this._bar < this.song.loopStart) {
                                    if (!this.enableIntro)
                                        this._bar = this.song.loopStart;
                                }
                                else {
                                    this.enableIntro = false;
                                }
                                if (this._bar >= this.song.loopStart + this.song.loopLength) {
                                    if (this.loopCount > 0)
                                        this.loopCount--;
                                    if (this.loopCount > 0 || !this.enableOutro) {
                                        this._bar = this.song.loopStart;
                                    }
                                }
                                if (this._bar >= this.song.bars) {
                                    this._bar = 0;
                                    this.enableIntro = true;
                                    ended = true;
                                    this.pause();
                                }
                                updateInstruments();
                            }
                        }
                    }
                }
            }
            if (this.stutterPressed)
                stutterFunction();
            this._playhead = (((this._arpeggio + 1.0 - this._arpeggioSamples / samplesPerArpeggio) / 4.0 + this._part) / this.song.parts + this._beat) / this.song.beats + this._bar;
        };
        Synth.prototype._frequencyFromPitch = function (pitch) {
            return 440.0 * Math.pow(2.0, (pitch - 69.0) / 12.0);
        };
        Synth.prototype._volumeConversion = function (toneVolume) {
            return Math.pow(toneVolume / 3.0, 1.5);
        };
        Synth.prototype._getSamplesPerArpeggio = function () {
            if (this.song == null)
                return 0;
            var beatsPerMinute = this.song.getBeatsPerMinute();
            var beatsPerSecond = beatsPerMinute / 60.0;
            var partsPerSecond = beatsPerSecond * this.song.parts;
            var arpeggioPerSecond = partsPerSecond * 4.0;
            return Math.floor(this.samplesPerSecond / arpeggioPerSecond);
        };
        return Synth;
    }());
    beepbox.Synth = Synth;
})(beepbox || (beepbox = {}));
