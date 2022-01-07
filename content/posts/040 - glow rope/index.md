---
title: "Glow Rope"
Date: 2016-07-13
Categories: Demos
draft: false
Tags:
 - demos
 - programming
 - javascript
 - threejs
 - webgl
 - 3d
 - web
 -  canvas
description: "A simple WebGL demo of streaming particles."
thumbnail: thumb.jpg
aliases: /demos/glow-rope
Mwc: 40
---

<div style="height: 80vh"></div>

<link rel="stylesheet" href="css/styles.css">

<canvas id="traffic"></canvas>

<script type="x-shader/x-vertex" id="vertexshader">
    uniform float TIMER_MAX;

    attribute float alive;
    attribute float size;
    attribute vec3  endPosition;
    attribute float timer;

    varying float vAlive;
    varying vec3  vEndPosition;
    varying float vTimer;
    varying float vProgress;

    void main() {
        vAlive       = alive;
        vEndPosition = endPosition;
        vTimer       = timer;
        vProgress    = 1.0 - vTimer / TIMER_MAX;
        vec3 newPosition = mix( position, endPosition, vProgress );
        vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
        gl_PointSize = size; // * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
    }
</script>

<script type="x-shader/x-fragment" id="fragmentshader">
    uniform sampler2D texture;
    uniform vec3  vStartColor;
    uniform vec3  vEndColor;

    varying float vAlive;
    varying vec3  vEndPosition;
    varying float vTimer;
    varying float vProgress;

    void main() {
        if ( vAlive == 0.0 ) discard;
        vec3 mixColor = mix( vStartColor, vEndColor, vProgress );
        gl_FragColor = vec4( mixColor, 1.0 - vProgress ) * texture2D( texture, gl_PointCoord );;
    }
</script>

<script src="src/three.min.js"></script>
<script src="src/main.js"></script>
