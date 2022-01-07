---
title: "Rippulous Pond"
date: 2022-01-06T10:54:48-05:00
Categories: Demos
Tags:
 -  programming
 -  demos
 -  javascript
 -  art
 -  web
 -  canvas
description: "Gaze ye into the rippulous pond unto eternity, witnessing patterns in time, colors in patterns, and even..."
thumbnail: thumb.png
mwc: 69
---

Gaze ye into the rippulous pond unto eternity, witnessing patterns in time, colors in patterns, and even...

<canvas id="i-want-moire" width=1920 height=1080></canvas>

<style>
canvas {
    object-fit: contain;
    width: 100%;
    position: relative;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    margin-top: 3em;
    margin-bottom: 3em;
}
</style>

<script>
const canvas=document.querySelector("canvas#i-want-moire"),ctx=canvas.getContext("2d"),WIDTH=700,HEIGHT=700,ASPECT=WIDTH/HEIGHT,COUNT_X=80,COUNT_Y=COUNT_X/ASPECT,COUNT=COUNT_X*COUNT_Y,GAP=WIDTH/COUNT_X,SIZE=6,RADIUS=340,DELAY=1e4,FADE=2e3,START_FLIP=200,SPEED=25227;console.table({WIDTH,HEIGHT,ASPECT,COUNT,COUNT_X,COUNT_Y,GAP}),canvas.width=WIDTH,canvas.height=HEIGHT;function easeInOutCubic(t){return Math.max(0,Math.min(1,t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2))}function draw(){requestAnimationFrame(draw);const t=performance.now();ctx.clearRect(0,0,canvas.width,canvas.height);for(var e=0;e<COUNT_X;++e)for(var o=0;o<COUNT_Y;++o){let s=GAP/2+e*GAP,c=GAP/2+o*GAP,n=Math.sqrt((WIDTH/2-s)**2+(HEIGHT/2-c)**2);if(n<RADIUS){let a=(RADIUS-n)*(t*easeInOutCubic(t/DELAY))/SPEED,i=Math.sin(a/4),_=Math.cos(a/4),l=(i+1)/2,r=(_+1)/2,h=s+i*2,f=c+_*2;ctx.fillStyle=`hsla(${r/2+l/2*220+180},100%,${10+(r/2+l/2)*70}%,${easeInOutCubic(t/FADE)})`,ctx.fillRect(h,f,SIZE,SIZE)}}}draw();
</script>

---

  I created this as a vanilla canvas exercise.  Typically, I'd use a three.js particle system for something like this, but when my coworker Daniel selected "make something with `<canvas>`" for our weekly coding challenge, it felt more pure to use the raw canvas API.

  This demo uses `fillStyle`, `fillRect`, and `clearRect` from the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D), plus some math for position and color.
