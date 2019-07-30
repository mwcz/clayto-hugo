---
title: "062   How Not to Make Svg Icons"
date: 2019-07-30T15:54:57-04:00
categories: Games
Tags:
 -  linux
description: "A whatsit."
thumbnail: thumb.jpg
mwc: 62
draft: true
---

## Discarded methods for including SVGs

There are a plethora of ways to put SVGs onto a page.  Here are all the alternatives I considered when implementing pfe-icon, and the reasoning why I moved on from each.

### &lt;use&gt;

[&lt;use&gt;][use] is an SVG element which clones an existing SVG.  Simply specify the `id` of the SVG you want to clone, and the *use* element will become a copy of it.

*use* comes in two flavors, local and remotes.

**local**

```svg
<svg>
    <use href="#id-to-copy">
</svg>
```
**remote**

```svg
<svg>
    <use href="https://mycdn.com/icons/icon.svg#id-to-copy">
</svg>
```

Predictably, the local version finds an SVG with `id="id-to-copy"` that already exists on the page, while the remote version fetches an SVG, finds `id="id-to-copy"` within it, and clones that.

While *use* could be a good fit for some icon libraries, I gave up on it after finding that it has the most extreme flavor of the same-origin policy I've ever seen.  Don't reach for that [CORS][cors] cheat-sheet.  There is no `Access-Control` header that will allow a cross-origin SVG to be loaded with *use*.  Any SVG hosted on a different origin will fail, period, and there is no workaround.

That restriction was too limiting.  We want anyone to be able to drop `<pfe-icon>` onto a page and use our built-in icons immediately, without having to go to great lengths to get the SVGs available on their origin.

Additionally, the same-origin restriction makes it impossible to serve SVGs from a CDN, which is a deal-breaker.

### fetch and make copies

This approach involves making a request for the SVG with [fetch][fetch], then injecting the SVG's text into the page with [innerHTML][innerhtml] (or [insertAdjacentHTML][insert-adjacent]).

This method functions, but wasn't very promising. One reason is that fetching text requires `Access-Control` headers for cross-origin requests.  While that's easier to digest than *use*'s outright ban on cross-origin requests, it's still too much to ask of pfe-icon's users.

Another reason this method wasn't promising is that it seemed very inefficient to inject the same SVG text over and over.  Instead, injecting the SVG once and then using [_use_][use-method] to clone it should be quite efficient, but the CORS requirements alone made it easy to move on.

### CSS background-image

This is the approach I spent the most time on, since it seemed by far the most promising.

```css
background-image: url("https://mycdn.com/svgs/rh-server.svg");
```

This approach has all the same pros and cons as using a an `<img>` tag.  We can consider them equivalent methods.

With this method, SVGs can be pulled from any origin.

One minor drawback is that SVG spritesheets aren't supported.  In other words, each SVG file must contain only a single icon.  That fits perfectly with our goal 1, but some icon libraries may wish to deliver icons in bulk sets (though I personally don't recommend it).

A more major drawback is that applying color to the icons is not as straightforward.  With a plain old SVG you can set a color with CSS: `fill: red`.That only works when the SVG element is in the DOM, but not when it's relegated to a background image.  I was stumped until I came across SVG filters (specifically [feFlood][feflood]), which can also be applied with CSS and had astonishingly good browser support.

To my consternation, while SVG filters worked perfectly for coloring background-image SVGs in all the browsers we care about, they did *not* work when used inside a Web Component.  The shadow DOM boundary breaks SVG filters in Edge, IE11, and all versions of Safari.


---

