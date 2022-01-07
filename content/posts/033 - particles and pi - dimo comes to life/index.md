---
Title: "Particles and π - DiMo Comes to Life"
Date: 2014-08-25
Categories: Demos
Tags:
 - demos
 -  programming
 -  javascript
 -  requirejs
 -  threejs
 -  webgl
 -  3d
 -  art
 -  sparkcon
 -  geekspark
 -  dimo
 -  physics
 -  web
 -  kimotion
 -  canvas
thumbnail: ./dimo-kids.jpg
description: "A player walks up Fayetteville St in Raleigh, North Carolina.  SPARKcon has begun, and dozens of artists are ..."
aliases: /2014/08/25/particles-and-p-dimo-comes-to-life/
resources:
 - name: gallery
   src: "gallery/*"
Mwc: 33
---

A player walks up Fayetteville St in Raleigh, North Carolina.
[SPARKcon][sparkcon] has begun, and dozens of artists are strewn along the
street, hard at work creating elaborate chalk art on the asphalt. A light rain
is falling, and some artists are holding umbrellas over their work, some have
draped tarps over themselves and their sketches, but most don't seem to care,
as if creating their art is more important than how long it lasts.

Up ahead is a gnarly-looking wrought-iron handrail covered in small
stegasaurus-like spikes. The spikes make its use as a handrail questionable,
but it does keep pedestrians from plummeting into the stairwell below.

The stairwell looks dingy, but a large green arrow points down, and so she
descends to escape the rain.

It's dark inside, but on the far wall, swirling clouds of colored dots orbit
around three circles. The silhouettes of three children stand on pedistals
near the wall, each one waving an illuminated baton.

<figure>
    <img src="dimo-kids.jpg" alt="children playing DiMo">
    <figcaption>photo by Yujin Kim</figcaption>
</figure>

After watching closely for a few moments, the rules of motion start to come
together in her mind. Each child's baton is emanating a different color; red,
green, and blue. As they swing the batons, large red, green, and blue circles
swoosh through the colored clouds.

The large colored circles seem to exert an attractive gravitational force on
the particles. Orbits are formed, and tiny solar systems glow brilliantly.

{{< vimeo 107405612 >}}

DiMo (short for Digital Motion) is an annual exhibit at GeekSPARK, which itself
is a branch of SPARKcon. I haven't been to any previous years' installations,
but this year included digital visualizations projected onto a large wall, with
three LED batons that visitors could use to control the visualizations.

I created one of the three "exhibits", the one you see in the video. Each
exhibit used the same set of input: the coordinates of the colored batons. My
exhibit is a particle gravity simulation, created with WebGL ([three.js][3js],
specifically), [GLSL][glsl], and many other tools.

### Event photos

Enjoy these photos from Digital Motion at SPARKcon 2014.

{{< load-photoswipe >}}
{{< gallery dir="/galleries/033" />}}

I'm working on a follow-up post, with technical information about the
implementation. _Update_ it's
[here]({{< ref "034 - the deconstruction of falling particles/index.md" >}})!

This (2014) was my first year as a volunteer, but it was a tremendously
educational and _fun_ experience, so I'll definitely be back next year.
_Update_ [2015's exhibit info and pictures!]({{< ref "/posts/039 - make a kimotion/index.md" >}})!

## Thanks

I've written mostly about my own contribution to DiMo here, because that's what
I'm most familiar with, but in reality it was only a piece of the DiMo puzzle.
There were two other visualizations, both of which used the lighted batons as
input. I would love to link to their creators' websites, but I'm still waiting
on URLs. Thanks to them, too!

Ian Hands, for organizing the project, asking me to participate, writing the
input server, and coming up with the whole idea.

Ben Pritchett for code contributions to the renderer and the server, and for
his work on two input sources (music BPM and a _brain machine_) which didn't
make it into this year's exhibit, but we'll almost certainly use next year.

Justis Peters is the lead coordinator of GeekSPARK, and, I think, the founder
of DiMo, and none of this would have happened without him.

Thanks also to the [Raleigh Fish Market Gallery][fishmarket] for providing us a
venue and letting us paint the projection wall white, and to Yujin Kim for
taking some awesome pictures.

Most of all, thank you to the visitors who descended that dingy stairwell to
see our exhibits! Seeing their smiles as they waved the batons was incredibly
rewarding. Everyone seemed to have fun. One kid liked it so much he cried
when it was time to leave.

![ring animation in dimo](ring-anim.gif)

You can find all the code at our [GitHub group][geeksparkrh]. The
visualization code described in this post is in the [dimo-renderer][renderer]
repo.

[sparkcon]: http://www.sparkcon.com/
[geeksparkrh]: https://github.com/geekspark-rh/
[renderer]: https://github.com/geekspark-rh/dimo-renderer
[justis]: https://twitter.com/justis
[iphands]: https://twitter.com/ianpagehands
[gpucalc]: http://vimeo.com/97329154
[ws]: https://en.wikipedia.org/wiki/WebSocket
[opencv]: http://opencv.org/
[fishmarket]: https://www.facebook.com/ncsufishmarket
[3js]: http://threejs.org/
[glsl]: https://en.wikipedia.org/wiki/OpenGL_Shading_Language
