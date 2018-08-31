---
Title: "Introducing Canvas Indexed Color"
Date: 2012-07-03
Tags:
 -  html5
 -  canvas
 -  color
 -  web
 -  canvas_indexed_color
description: "A basic implementation of indexed color palettes for HTML5 canvas."
thumbnail: thumb.png
aliases: /2012/07/03/introducing-canvas-indexed-color/
Mwc: 21
---

_2018-08-29 update:_ This is an old post about how I created a thin indexed color API in front of HTML5 canvas. It wasn't very usable or powerful, but it was a fun learning experience. Instead of reading the post, I recommend checking out Mark Ferrari's [breathtaking color cycling art](http://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html "Color cycling in HTML5 canvas"). from 90s adventure games.

---

![White SVG Tiger](hahatiger.png)

First, I converted the classic SVG tiger into a set of canvas drawing
instructions using [Professor Cloud's conversion
tool](http://professorcloud.com/svg-to-canvas/ "Professor Cloud's conversion
tool"). The output looks like
[this](https://github.com/mwcz/palebluepixel/blob/master/content/static/projects/canvas_indexed_color/demo/vector_images.js). Each call to `cvm.getColor()` used to be a string literal.

Vim's regex saved me from having to edit _100,000_ lines of canvas instructions
by hand to replace the color strings.

The demo uses [Knockout](http://knockoutjs.com/ "Knockout JS") for handling all
the update/draw events as well as updating the URL hash. Check the [source
code](https://github.com/mwcz/palebluepixel/blob/master/content/static/projects/canvas_indexed_color/demo/cic.js)
and you'll see that there _isn't_ a vast tangled nest of event
wirings. Each time one of the colors in this ViewModel is changed, Knockout
automatically triggers the canvas redraw and the updates the URL with the new
palette. Conversely, if the URL is changed, the ViewModel will update itself
with the new value. Knockout calls this a "two-way data binding".

I replaced the aforementioned color strings with calls to `cvm`, which is a
Knockout ViewModel (in this case, an object that holds all the color data).
`cvm` is populated with the SVG tiger's default colors.

```javascript
ko.observableArray([
  { hex: ko.observable("#000000") },
  { hex: ko.observable("#323232") },
  // .... many more ....
  { hex: ko.observable("#ff727f") },
  { hex: ko.observable("#ffffff") }
]);
```

Play with the colors, then copy the URL and send your tiger to your friends. :]

[Crazy tiger](/projects/canvas_indexed_color/#4c0000,#659900,#666666,#992600,#999999,#99cc32,#a51926,#a5264c,#b23259,#b26565,#b2b2b2,#cc3f4c,#cc7226,#cccccc,#e5668c,#e59999,#e5e5b2,B5E8E6,#ea8c4d,#ea8e51,#eb955c,#ec9961,#eea575,#efaa7c,#f1b288,#f2b892,#f3bf9c,#f4c6a8,#f5ccb0,#f8d8c4,#f8dcc8,#f9e2d3,#fae5d7,#fcf2eb,#ff727f,#ffffcc,#ffffff,#000000,#323232 "Crazy tiger").

Please note, this is only a simulation of an indexed color palette. It is not
a true, usable, indexed-color API for canvas (someday, maybe!).

The color picker is [Farbtastic](https://github.com/mattfarina/farbtastic "Farbtastic"). If you're interested in reading more about the history of
indexed color, and a **mind-blowing** canvas demo, go
[here](http://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html "Color cycling in HTML5 canvas").
