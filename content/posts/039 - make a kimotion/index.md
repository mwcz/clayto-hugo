---
Title: "Make a Kimotion!"
Date: 2015-09-26
Tags:
 -  programming
 -  javascript
 -  threejs
 -  webgl
 -  3d
 -  2d
 -  art
 -  sparkcon
 -  geekspark
 -  dimo
 -  physics
 -  web
 -  kimotion
 -  canvas
description: 'Kimotion is a new framework for building interactive art exhibits.  It will appeal mostly to the Programmer Artist types.  Think "Warrior Poet", but with keyboards.'
thumbnail: thumb.jpg
aliases: /2015/09/26/make-a-kimotion/
Mwc: 39
---

A year ago, I had the joy of working on Digital Motion, an [interactive
art][intart] exhibit for Raleigh's annual art festival, [SPARKcon][sparkcon].
The month leading up to SPARKcon 2014 was a mad dash of perfecting the graphics
and physics equations of my [DiMo: Particles][dimo-particles] display. After a
wonderful weekend of watching visitors enjoy the weird things we made, a lesson
began congealing itself in my mind.

_Creating interactive art exhibits from scratch is **really** hard. Maybe I
can share some of this work, so others can focus on the art..._

Creative coding is _so much fun_ that I can't help but wish more people were
involved. Nothing cures curmudgeony coders faster than working on a project
where mistakes often make it _better_. With such a steep learning curve,
though, few would get involved. There would need to be a shared foundation.

{{< toc >}}

## Enter Kimotion

[Kimotion][kimotion-web] is a new framework for building interactive art
exhibits. It will appeal mostly to the Programmer Artist types. Think
"Warrior Poet", but with keyboards.

With Kimotion, you can create a "mod" which is essentially your own blank
canvas. On the canvas, you can paint pixels, but not boring, everyday pixels.
What you paint can be animated by the movements of the people in the room.

Videos speak louder than text, so here are some videos of a variety of mods.

{{< vimeo 136951447 >}}

I began building Kimotion in February of 2015, well in advance of SPARKcon X,
which took place in September. This was a far cry from the single month of
harebrained scampering of the year before! The extra time, and the existance
of a true framework, allowed many more people to create visualizations (aka
"mods"). In the end, fifteen mods were created in time for the SPARKcon
exhibit.

_Over a thousand_ people visited our exhibit last weekend. It's hard to put
into words how rewarding it is to see so many children and adults enjoy the sum
of our planning, hard work, and creativity.

<!-- Commented out until a good gallery solution is in place.
## Gallery

Here are some photos from SPARKcon X (2015), and setup the night before.

$GALLERY
-->

## The future

What's next for Kimotion? Several SPARKcon attendees had excellent ideas.
From installing Kimotion in schools to putting a permanent installation in
their own homes.

I love the school idea in particular because, if last weekend was any
indication, kids love this thing and it really encouraged them to move (a lot).

It would cost a school system very little. Schools already have (one would
hope) computers and projectors or smartboards. Kimotion itself is free and
open-source. The only cost would be the Kinect. First-edition Kinects often
sell for less than $30 each. If anyone on a PTA or school board reads this and
finds it interesting, <a href="mailto:mwc@clayto.com">email</a> or <a
href="https://twitter.com/mwcz">tweet</a> me.

I started Kimotion with the hope that it would encourage programmers to use
their skills to create elegance that everyone can appreciate. If children are
also encouraged to exercise, I won't complain!

## E Pluribus Unum

I can't express how grateful I am to everyone who contributed to Kimotion
itself, created mods, and made the Digital Motion exhibit at SPARKcon a huge
success this year.

- **Greg Gardner** : for taking over and perfecting the kimotion server, implementing record/replay for easy development, and helping me debug _countless_ graphical glitches and client issues, and being a software architecture guiding hand
- **Jared Sprague** : for creating the immaculate Fish game mod, beloved by all children, building a new computer to run the exhibit, and cohosting the event with me
- **Ben Pritchett** : for writing tutorial documentation and the great Snake mod
- **Cas Roberts** : for endless encouragement and great ideas, including the very successful recording/replay scheme
- **Truett Thompson** : for keeping geekSPARK on track, on schedule, and funded
- **Kevin Howell** : for creating the enigmatic, unexplainable, and beautiful Spiral mod
- **Ian Hands** : for looping me into the most fun project I've ever worked on
- **Noel White** : for so much organizational geekSPARK work and fundraising
- **Mary Hands** : for saving the entire exhibit friday night when we were flummoxed by hardware failure
- **Kyle Buchanan** : for great questions and alllllllmost finishing his Starfighter mod
- **Justis Peters** : for paving the DiMo trail for the rest of us to follow
- **Dave Yarwood** : for contribution to docs, great questions, and allllllmost-finished music mod
- **Rowen Sprague** : for being the official tester

## More information

- The News & Observer wrote a [nice article][nando] about SPARKcon including lots of geekSPARK coverage and footage
- [Kimotion main project page][kimotion-web]
- [Kimotion source code][kimotion-code]
- [More about last year's exhibit][dimo-particles]
- [Opensource.com article about DiMo 2014][osdc]
- [The Deconstruction of Falling Stars]({filename}/posts/034 - the deconstruction of falling particles/034 - the deconstruction of falling particles.md) - technical info about how it was built
- [Particles and π - DiMo Comes to Life]({filename}/posts/033 - particles and pi - dimo comes to life/033 - particles and pi - dimo comes to life.md) - more about the exhibit at SPARKcon!

[kimotion-web]: http://kimotion.xyz
[kimotion-code]: https://github.com/mwcz/Kimotion
[kimotion-videos]: http://kimotion.xyz/#videos
[thumbnails]: thumbnails.png
[p5js]: http://p5js.org
[threejs]: http://threejs.org
[dimo-particles]: /projects/dimo
[sparkcon]: https://en.wikipedia.org/wiki/Sparkcon
[osdc]: http://opensource.com/life/15/2/sparkcon-geekspark-digital-motion-exhibit
[intart]: https://en.wikipedia.org/wiki/Interactive_art
[nando]: http://www.newsobserver.com/news/local/counties/wake-county/article35910324.html
