---
Title: "Introducing Drop64, ezpz data URI generator"
Date: 2014-02-25
Tags:
 -  html5
 -  javascript
 -  data uri
 -  web
description: "Speed-hacking an old project for fun and... fun."
thumbnail: recording.gif
Mwc: 25
---

A few weeks ago, a [coworker][1] of mine ran into some font issues.  Firefox
doesn't allow cross-origin requests for [web fonts][2], and he was using a tool
called [Font Squirrel][3] to generate fonts, including [data URIs][4].

Embedding a data URI for a font (or image) inside a CSS file is a common
technique for reducing the number of HTTP requests.  In this case, it also
negates the need for a cross-domain request to fetch the font file, because the
file's contents are already embedded.

There was something screwy about Font Squirrel's data URIs, though.  A change
must have been made to their tool, because all of our icons were suddenly
shifted up.

Once we narrowed it down to a misbehaving tool, the solution was clearly to
create a new, better behaved tool.

I pretty quickly realized that ColorPal is basically a drag-and-drop data URI
generator.

By dropping a file into ColorPal's dropzone, the user is implicitly giving the
browser access to that file through the HTML5 File API.  That file's contents
are conveniently (for our purposes, anyway) exposed as a data URI.

ColorPal takes the extra steps of injecting the URI into a canvas element, then
performing a color quantization algorithm on the resulting pixels.

Drop64 is ColorPal with a bunch of features ripped out.

So, in the span of about 20 minutes I forked ColorPal, changed the name and
logo, ripped out the quantization algorithm, displayed the data URI into an
output box, created a github page for it, and registered [drop64.com][7].

Voila:

![Drop64 recording](/static/images/projects/drop64/recording.gif Drop64 recording)

It's not exactly a technical marvel, and the code is still rife with ColorPal
stuff.  I only ripped out what was absolutely necessary to get the tool working
as fast as possible.

[Try it out][7] or [check out the code][6].  Happy hacking.

[1]: http://www.heyokadesign.com/
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
[3]: http://www.fontsquirrel.com/
[4]: https://developer.mozilla.org/en-US/docs/data_URIs
[5]: http://colorpal.org/
[6]: https://github.com/mwcz/Drop64
[7]: http://drop64.com/
