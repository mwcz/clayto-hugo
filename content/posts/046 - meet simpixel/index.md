---
Title: "Meet SimPixel"
Date: 2017-03-10
Categories: Demos
aliases: /2017/03/10/meet-simpixel
Tags:
 -  programming
 -  demos
 -  javascript
 -  threejs
 -  webgl
 -  3d
 -  art
 -  web
 -  led
 -  maniacal-labs
 -  canvas
description: "A WebGL-based visualizer for LED displays."
thumbnail: ./thumb.jpg
Mwc: 46
---

I have someone I'd like you to meet. SimPixel, meet everyone. Everyone,
SimPixel.

<div id="simpixel-container"></div>

# SimPixel, introduce yourself

SimPixel is a WebGL visualizer for LED displays, _very_ much like the ones Adam
and Dan build over at [Maniacal Labs][mlabs].

<style type="text/css">
#mlabs {
    height: 50vh !important;
}
@media screen and (min-width: 660px) {
    #mlabs {
        float: right;
        margin-left: 20px;
    }
}
</style>

<figure>
<img src="maniacal.jpg" alt="some Maniacal Labs LED projects" />
</figure>

Very much alike.  In fact, it's probably _so_ much like their displays because I built
most of SimPixel while sitting at Adam's workbench. I don't know, there could
be a connection. If you too would like to take a seat at Adam's illustrious
workbench someday, [hack away][source]. You can also try the [fullscreen
demo][demo].

[BiblioPixel][biblio], <abbr title="Maniacal Labs">ML's</abbr> light animation
library, sends layouts and colors to SimPixel using a simple [WebSocket][ws]
protocol.

---

# The Protocol

By itself, SimPixel is useless. To turn on the lights, it connects to a
WebSocket service. That service is expected to send certain messages, namely a
configuration message followed by a series of color messages.

---

## Configuration message

The configuration message conveys the spatial layout of the LEDs.

For example, a configuration message of `0x0000009A02FE000C` is interpreted as
follows.

| opcode |    X |    Y |    Z
|--------|------|------|------
| 0x0000 | 009A | 02FE | 000C
| config |  154 |  766 |   12

The leading `0x0000` opcode identifies this as a configuration (ie, setup) message,
followed by a series of 16-bit signed integers which indicate the 3D
coordinates of each LED, of the form: <code>X<sub>1</sub>,Y<sub>1</sub>,Z<sub>1</sub>,X<sub>2</sub>,Y<sub>2</sub>,Z<sub>2</sub>,
..., X<sub>n</sub>,Y<sub>n</sub>,Z<sub>n</sub></code>

---

## Color message

The color message(s) specify what color each LED should be at the current
moment in time.

An example color message, `0x0001 40 D6 7F`, breaks down to:

| opcode |   R |   G |   B |
|--------|-----|-----|-----|
| 0x0001 |  40 |  D6 |  7F |
| color  |  64 | 214 | 127 |

The leading `0x0001` opcode identifies this as a color message, followed by a
series of 8-bit unsigned integers which indicate the RGB colors of each LED,
of the form:
<code>R<sub>1</sub>,G<sub>1</sub>,B<sub>1</sub>,R<sub>2</sub>,G<sub>2</sub>,B<sub>2</sub>,
..., R<sub>n</sub>,G<sub>n</sub>,B<sub>n</sub></code>

For a concise reference, see [PROTOCOL.md][protocol].

---

# The Ghost in the Recording

The live demo at the top of this post isn't connected to any WebSocket service.
Instead, it's using a recording apparatus that I cobbled together. I pushed
a configuration frame and a bunch of color frames into an array, converted
their ArrayBuffers into base64 strings, and saved those into [a quite large
JSON recording file][rec].

I only mention it to lead up to the following. While editing the recording
JSON file, I zoomed out a little and something caught my eye. I zoomed out
more and a pattern took shape.

Here's a screenshot of the JSON file in my terminal, zoomed out as far as it'll
go.

![image of base64-encoded recording](recording-base64.png)

The waves of red, green, and blue is evident even in this doubly-encoded
format. Pretty cool.

<!-- SimPixel embedded -->

<div id="connection"></div>

<style type="text/css">
    #simpixel-container {
        width: 100%;
        height: 80vh;
        cursor: move;
    }
    #connection { display: none; }
</style>

<script type="x-shader/x-vertex" id="vertexshader">
    uniform float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
</script>

<script type="x-shader/x-fragment" id="fragmentshader">
    uniform vec3 color;
    uniform sampler2D textureOn;
    uniform sampler2D textureOff;
    varying vec3 vColor;
    void main() {
        /* if color attribute is not black, use 'on' texture with color*/
        if (length(vColor) > 0.0) {
            gl_FragColor = vec4( (color/255.0) * vColor, 1.0 );
            gl_FragColor = gl_FragColor * texture2D( textureOn, gl_PointCoord );
        }
        /* if color attribute is black, use 'off' texture and dark grey */
        else {
            gl_FragColor = vec4(0.4);
            gl_FragColor = gl_FragColor * texture2D( textureOff, gl_PointCoord );
        }
    }
</script>

<!-- third party -->
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js"></script>
<script defer src="js/Detector.js"></script>
<script defer src="js/OrbitControls.js"></script>
<script defer src="js/reconnecting-websocket.js"></script>

<!-- first party -->
<script defer src="js/bp_host.js"></script>
<script defer src="js/conf.js"></script>
<script defer src="js/recording.js"></script>
<script defer src="js/view.js"></script>
<script defer src="js/main.js"></script>

<div hidden>
    <img src="thumb.jpg">
</div>

[mlabs]: http://maniacallabs.com/
[ws]: https://en.wikipedia.org/wiki/WebSocket
[source]: https://github.com/ManiacalLabs/SimPixel
[protocol]: https://github.com/ManiacalLabs/SimPixel/blob/master/PROTOCOL.md
[rec]: https://github.com/ManiacalLabs/SimPixel/blob/recording-draft/src/recordings/vis.json
[biblio]: https://github.com/ManiacalLabs/BiblioPixel/wiki
[demo]: /static/projects/simpixel
