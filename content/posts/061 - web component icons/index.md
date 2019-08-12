---
title: "Icons & Web Component"
date: 2019-07-25T15:11:23-04:00
Tags:
 -  web
 -  javascript
 -  web-components
 -  patternfly
description: "Creating an icon system for PatternFly Elements, using Web Components and SVGs."
thumbnail: thumb.png
mwc: 61
draft: true
---

<!-- use polyfills and ES5 build of PFE for maximum browser compatibility -->
<script src="./custom-elements-es5-adapter.js"></script>
<script src="./webcomponents-loader.js"></script>
<script src="./elements/pfelement/pfelement.umd.min.js"></script>
<script src="./elements/pfe-icon/pfe-icon.umd.min.js"></script>
<script src="./pfe-icon-fa.js"></script>

This is the story of `pfe-icon`, an icon component I've been working on for the [PatternFly Elements][pfe] project.  It's a [Web Component][web-components] for displaying icons, and is compatible with any set of SVG icons.

Before the rambling begins, let's have a **demo**!

<style>
.icon-panel {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  justify-items: center;
}
body {
  --pfe-broadcasted--color--text: var(--pbp-fg-color, white);
}
</style>

Red Hat icons:

<div class="icon-panel">
  <pfe-icon style="--pfe-broadcasted--color--text: #CE393C" size="xl" icon="rh-aed"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #F39A42" size="xl" icon="rh-sun"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #56BD58" size="xl" icon="rh-leaf"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #8E59CB" size="xl" icon="rh-puzzle-piece"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: var(--pbp-blue, #6FA5F2)" size="xl" icon="rh-space-rocket"></pfe-icon>
</div>

Font Awesome icons:

<div class="icon-panel">
  <pfe-icon style="--pfe-broadcasted--color--text: #CE393C"  size="lg" icon="fa-brands-redhat"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #F39A42"  size="lg" icon="fa-brands-accessible-icon"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #56BD58"  size="lg" icon="fa-regular-eye"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: #8E59CB"  size="lg" icon="fa-regular-grin-hearts"></pfe-icon>
  <pfe-icon style="--pfe-broadcasted--color--text: var(--pbp-blue, #6FA5F2)" size="lg" icon="fa-regular-envelope"></pfe-icon>
</div>

---

{{< toc >}}

---

## Features

 1. **On-demand icon loading**
 2. **No CORS restrictions**
 3. **Icon coloring**
 4. **Concise syntax**
 5. **Icon sets**

This post walks through how the features above were implemented.

---

## The pfe-icon tag

Here's a typical pfe-icon tag.

```html
<pfe-icon icon="rh-server"></pfe-icon>
```
Result:

<center>
<pfe-icon size=xl icon="rh-server"></pfe-icon>
</center>

While this syntax isn't the tersest possible, it's also not needlessly verbose.

The icon name, `rh-server`, belongs to an icon set named `rh` and pfe-icon will map the icon name to a URL where an SVG lives.  This mapping allows the icon name to stay nice and terse (much terser than a full URL).

I also would have preferred a self-closing tag, but Custom Elements can't be self-closing (only a small set of "[void elements][void]" can).

So, while not the pithiest possible syntax, this is the pithiest practical syntax.  "Concise syntax" <pfe-icon style="--pfe-broadcasted--color--text: green" icon="rh-check-yes"></pfe-icon> check.

Next let's look more at the icon name, and how it leads to an SVG being displayed.

## Icon sets

When pfe-icon sees `icon="rh-server"` the first thing it does is figure out what icon set it belongs to.  The first `-` in an icon name separates the *icon set's* name from the *icon's* name.  Following that rule, we find the icon set is `rh`.  For example, the name `rh-construction-hard-hat` represents icon `construction-hard-hat` inside an icon set named `rh`.  Icon set namespacing (part of goal 5) achieved.

At this point, pfe-icon knows the names of the icon itself and the set it belongs to, but doesn't know yet where to get the SVG.  That's where icon set definitions come in.  When defining an icon set, you provide three bits of information, the set name, a base URL to the SVG library, and a function, `resolveIconName`,  which transforms icon names into an SVG's URL.  [More about icon sets][icon-sets].

---

### Defining a custom icon set

Icon sets are designed so that `<pfe-icon>` can be used with any set of SVGs, no matter what directory structure or naming conventions are used.

Here's an example of defining an icon set.  Let's say we have a bunch of SVG files hosted at `https://mycdn.com/svgs`. Listing the `svgs` directory would look like this:

```
https://mycdn.com/svgs/
├── horse.svg
├── battery.svg
├── staple.svg
└── coconut.svg
```

Just for fun, let's give this icon set the name "ico".  With all that established, here's how the icon set can be defined for use with pfe-icon.

```js
import PfeIcon from "@patternfly/pfe-icon";

PfeIcon.addIconSet(
    "ico",
    "https://mycdn.com/svgs",
    (iconName, setName, path) => `${path}/${iconName}.svg`
);
```
Here are the arguments for the `addIconSet` function.

| arg | type | description |
| --- | --- | --- |
| set name | String | the name of your icon set (cannot contain hyphens) |
| set path | String (a URL) | a fully qualified URL to the base directory of an SVG library |
| resolveIconName | Function | a function that accepts (iconName, setName, setPath) and returns a URL to an SVG |

#### resolveIconName

The heart of pfe-icon's flexibilty is `resolveIconName`.  It's a custom function which turns a lucid, human-friendly name like `"rh-puzzle-piece"` into a URL where pfe-icon can fetch an SVG.

```html
<pfe-icon icon="rh-puzzle-piece"></pfe-icon>
```
```js
(iconName, setName, path) => `${path}/${iconName}.svg`
```

stitching together `path`, `icon` and `.svg`.  This is possible because the directory structure of the imaginary SVG library is very simple.  For icon libraries where the directory structure or filename conventions are more complex, those complexities can be smoothed over with special logic in the resolveIconName function, with the aim of retaining goal 4 (minimal syntax).

Whatever set of SVG icons you have, you can write a `resolveIconName` function that translates friendly icon names into full URLs, no matter what naming conventions the icon library has.

### Organizing icon sets

Many icon libraries sort icons into logical sets.  Sets like "social network logos" or "road signs" are useful when searching for a specific icon.  However, when a logical set is bundled together, you wind up including a font on your page which includes *every* social network logo.

To avoid that, pfe-icon decouples **logical sets** from **delivery bundles**.  That's the main idea behind goal 1, and many of the implementation decisions (like not using a font to deliver icons).  Also, new icons should be put into the most logical set, without having to weigh how large the set is.  You should never be tempted to create a new, _illogical_ set, just to keep bundle size down.

---

## SVG injection method

To actually get the icon onto the page, the SVG URL is placed into a SVG `<image>` element's `xlink:href` attribute.  The SVG exists inside pfe-icon's shadow root and looks something like this:

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="color-filter" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
    <feFlood result="COLOR" />
    <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
  </filter>
  <image xlink:href="" width="100%" height="100%" filter="url(#color-filter)"></image>
</svg>
```


There were many considerations that went into picking this approach for injecting SVGs, but the biggest one is that this approach allows SVGs to be loaded from any origin.  More about [other SVG injection methods][discarded].

After Safari's incompatibility forced me to move on from the most promising method ([CSS background image][css-bg]), I was stumped.  If SVG filters couldn't work inside Safari's Web Component implementation, would I have to give up and start from scratch?

I had some hunches about why SVG filters don't work in Safari shadow DOMs.  One hunch was something to do with the fact that each SVG has its own shadow DOM.  Another was that Safari was having trouble looking up the SVG by its `id`.  Perhaps it was doing a naive `document.body.getElementById` rather than looking inside the nearest shadow root, for example.  Perhaps both hunches are true and related somehow.

Anyway, I figured that if those hunches were true, the problem would disappear if the `<filter>` and the icon existed inside the same SVG element.  That led me to [`<image>`][svg-image], and when I tried it out, it worked perfectly.  Well, not in IE11, but everywhere else.

## Icon coloring

The last point to cover in the summary is how icons get colored.  If the SVGs were directly embedded on the page, they could be colored with a simple CSS rule like `svg { fill: blue }`.  However, since we're including the SVGs remotely (via `<image xlink:href="URL">`), they can't be affected by the `fill` property.  There is another approach, which might sound a bit hacky, but it works well: SVG filters.  More about SVG filters for [coloring][coloring].


That's it for the summary!  Below are more thorough explanations of each part of the implementation.

---

## Performance

Theoretically, performance should be very good due to fetching only the icons in use.  Theory doesn't always pan out though, so here are some reasons to feel optimistic about pfe-icon performance.

### Icon size

The built-in icons are in the 0.5-1.5 kB range (gzipped). Pretty small.

### HTTP

In the HTTP/1.1 days, making a separate HTTP request for each each SVG would have been a firm **No**, but HTTP/2 has changed that rule of thumb.

I ran a test on a sample page with 291 icons.  These HTTP request visualizations tell the story.

<figure>
<img alt="Very cluttered visualization of HTTP/1.1 requests for 291 icons." src="./http1.png">
<figcaption>HTTP/1.1</figcaption>
</figure>

<figure>
<img alt="Clean, streamlined visualization of HTTP/2 requests for 291 icons." src="./http2.png">
<figcaption>HTTP/2</figcaption>
</figure>

Apps that import and bundle icons during a build will probably still beat out pfe-icon, but I'm okay with that.  As a Web Component, pfe-icon can work anywhere, whereas build-time icons are less portable.

### Lighthouse

As for hard numbers, I ran a few quick [Lighthouse][lighthouse] tests on the sample page with 291 icons.  The results are very promising: 98/100.

There are always more performance axes to measure.  The initial results are very promising, but more testing would be good to have.

---

## Browser support

Browser support is very good.  However, icon coloring doesn't work in Microsoft browsers (IE11 and Edge), so pfe-icon falls back to monochrome icons in those browsers.

![browser support thumbnails][browsers]

You can scan the full [gallery of screenshots][browser-gallery].

### Puzzler: MS Edge icon coloring

Something puzzling to note... at one point icon coloring *did* work in Edge.  I swear.  I have a screenshot of colored icons in Edge on day I discovered the `<image>` element, but the next day it no longer worked.  I spent an entire day [bisecting][bisect] my commits, trying to figure out what changed, with no luck.  My only guess is that a minor version change in ShadyCSS is to blame.  In the end, icon coloring in Edge was not important enough to spend more time on it.

---

## Recap

Icon sets are namespaced and can support any collection of SVGs by providing a custom [resolveIconName][resolveiconname] function, which maps concise icon names to URLs where each SVG can be found.

CORS issues are avoided by including SVGs as images, via the SVG `<image>` element.

Icons are colored with an SVG `<filter>` element, and colors can be passed in with a CSS variable.


[pfe]: http://patternfly.org/patternfly-elements
[icon-sets]: #all-about-icon-sets
[discarded]: #discarded-methods-for-including-svgs
[coloring]: #svg-filters-for-coloring
[use]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[cookieless]: http://www.ravelrumba.com/blog/static-cookieless-domain/
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[innerhtml]: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
[insert-adjacent]: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
[use-method]: #lt-use-gt
[feflood]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFlood
[svg-image]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image
[browsers]: https://user-images.githubusercontent.com/364615/61894462-7f1b9e80-aede-11e9-8c8a-cb403927fb09.png
[browser-gallery]: https://imgur.com/a/waA2ssx
[resolveiconname]: #resolveiconname
[web-components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[font-awesome]: https://fontawesome.com/
[css-bg]: #css-background-image
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[bisect]: https://git-scm.com/docs/git-bisect
[void]: https://html.spec.whatwg.org/multipage/syntax.html#void-elements
