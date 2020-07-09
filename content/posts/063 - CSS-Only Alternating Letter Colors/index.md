---
title: "CSS Only Alternating Letter Colors"
date: 2020-02-28T14:14:52-05:00
Tags:
 -  css
description: "A whatsit."
thumbnail: thumb.jpg
mwc: 56
draft: true
---

This morning, my manager presented me with a challenge: write some code to alternate letter colors.  I offered to implement it using only CSS.

<style type=text/css>
@font-face {
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Source Code Pro Bold'), local('SourceCodePro-Bold'), url(https://fonts.gstatic.com/s/sourcecodepro/v11/HI_XiYsKILxRpg3hIP6sJ7fM7Pqths7Ds-cv.ttf) format('truetype');
}
.alternate {
  --character-width: 0.602em;
  --color-1: #8727A6;
  --color-2: #D34CF9;
  font-size: 50px;
  font-family: "Source Code Pro";
  text-shadow: 1px 1px 3px;
  background: black;
  color: white;
  filter: invert();
}
.alternate:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(90deg, var(--color-1) var(--character-width), var(--color-2) var(--character-width));
  background-size: calc(2 * var(--character-width));
  filter: invert();
  mix-blend-mode: multiply;
}


.challenge-accepted {
  display: inline-block;
}
</style>

<center>
<div class="challenge-accepted alternate">
CHALLENGE ACCEPTED!
</div>
</center>

We agreed on the terms:

 - No JavaScript
 - The text could be wrapped in a `div` or `span`, but no other markup could be used


I started by finding out if there is an `nth-letter()` selector yet.  Nope.  That's okay, my backup plan was to use `mix-blend-mode` to apply an image's colors to the text below.  After quite a bit of experimentation, I came up with this:

{{< codepen tab="css,result" id="rNVmQrJ" >}}

Originally, I was using a 2x1 SVG like this one, with both colors.

<img src="./two-colors.svg">

CSS with alternating letter colors.


## Pros and Cons

### Cons

It can only be used with monospace fonts because it relies on predictable character widths.

It only works on white backgrounds, because black is the only color that won't have the `multiply` blend mode applied.



[Wes Ruvalcaba][wesruv] offered two big improvements:

 - `em`-based width, which enabled the letter coloring to scale properly at all zoom levels and font sizes
 - replacing the image file with a CSS-based linear gradient

[wesruv]: http://www.wesruv.com/
