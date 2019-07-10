---
Title: "Bouncey returns - more canvas physics"
Date: 2011-11-18
Tags:
 -  html5
 -  canvas
 -  physics
 -  javascript
 -  bouncey
 -  web
thumbnail: thumb.png
aliases: /2011/11/17/bouncey-returns-more-canvas-physics/
Mwc: 8
---

This is a slightly upgraded version of the physics demo I showed in my [last post]({{< ref "007 - bouncey, html5 canvas physics/index.md" >}}).

It is still...

<quote>"a buggy, rudimentary, just-for-fun javascript physics simulator."</quote>

This version has:

- pre-defined initial states
- gravity
- friction

It still has the "clinging" bug. I know how to fix it, but didn't deem it important enough to spend time on it. :)

The [code](https://github.com/mwcz/bouncey/blob/master/bounce.html) is well commented, so feel free to hack on it.

Click on one of the initial states to begin the simulation.

<style type="text/css">
#cnvs {
    margin: 0 auto;
    border: 1px solid black;
    -webkit-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
       -moz-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
         -o-box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
            box-shadow: 0px 0px 3px rgba( 0, 0, 0, 0.7 );
}
</style>

<script type="text/javascript" src="bouncey.js"></script>

Choose an initial state:
<button onclick="RANDOM();">Random</button>
<button onclick="POOL();">POOL</button>
<button onclick="HEAD_ON_COLLISION();">HEAD_ON_COLLISION</button>

<canvas id="cnvs" width="500" height="375">
    Sorry, your browser does not support HTML5 canvas.  Lame.
</canvas>

<button onclick="paused++;paused%=2;this.textContent=paused?'Play':'Pause'">Pause</button>

<pre>
  velocity sum: <span id="txt_velocity_sum">NONE</span>
x velocity sum: <span id="txt_velocity_sum_x">NONE</span>
y velocity sum: <span id="txt_velocity_sum_y">NONE</span>
</pre>

<script>
HEAD_ON_COLLISION();
</script>

(The POOL initial state reproduces the clinging bug.)
