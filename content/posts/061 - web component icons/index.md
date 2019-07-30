---
title: "Web Component Icons"
date: 2019-07-25T15:11:23-04:00
categories: Games
Tags:
 -  web
 -  javascript
 -  web-components
 -  patternfly
description: "Creating an icon system for PatternFly Elements, using Web Components and SVGs."
thumbnail: thumb.jpg
mwc: 61
draft: true
---

<script defer type="module" src="./elements/pfe-icon/pfe-icon.min.js"></script>

This is the story of `<pfe-icon>`, an SVG-based icon [Web Component][web-components] I've been working on for the [PatternFly Elements][pfe] project.

Before the rambling begins, let's have a **demo**!

<style>
.icon-panel {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
}
</style>

<div class="icon-panel">
<pfe-icon style="--pfe-broadcasted--color--text: #CE393C" size="xl" pfe-icon="rh-aed"></pfe-icon>
<pfe-icon style="--pfe-broadcasted--color--text: #F39A42" size="xl" pfe-icon="rh-sun"></pfe-icon>
<pfe-icon style="--pfe-broadcasted--color--text: #56BD58" size="xl" pfe-icon="rh-leaf"></pfe-icon>
<pfe-icon style="--pfe-broadcasted--color--text: #8E59CB" size="xl" pfe-icon="rh-puzzle-piece"></pfe-icon>
<pfe-icon style="--pfe-broadcasted--color--text: var(--pbp-blue)" size="xl" pfe-icon="rh-space-rocket"></pfe-icon>
</div>

---

{{< toc >}}

---

## Features

 1. **On-demand icon loading**
 2. **No CORS restrictions**
 3. **Icon coloring**
 4. **Minimal syntax**
 5. **Icon sets**

---

## Implementation summary

### The tag

```html
<pfe-icon pfe-icon="rh-server"></pfe-icon>
```

It's not as concise as I would have liked, but still, not _too_ bad.

Pretty concise.  I would have preferred the attribute be simply `icon`, but our project, PatternFly Elements, has a convention of prefixing all custom attributes with `pfe-` so that it's clear which attributes belong to our components, versus standard HTML attributes.  Still, it's not _too_ long or confusion, so goal 4 achieved.

Goal 4 semi-achieved!


### Icon sets

pfe-icon looks at the icon name, `rh-server`.  The `rh` represents the name of an icon set.  The first `-` in an icon name separates the namespace from the rest of the icon name.  For example, the name `rh-construction-hard-hat` represents icon `construction-hard-hat` inside an icon set named `rh`.  Namespaces (goal 5) achieved.

At this point, pfe-icon knows the names of the icon set and the icon, but doesn't know yet where to get the SVG.  That's where icon sets come in.  When defining an icon set, you provide three bits of information, the set name, a base path to the SVG library, and a parseIconName function which transforms icon names into an SVG's URL.  [More about icon sets][icon-sets].

### SVG injection method

To actually get the icon onto the page, the SVG URL is placed into a SVG `<image>` element's `xlink:href` attribute.  There were many considerations that went into picking this approach for injecting SVGs, but the biggest one is that this approach allows SVGs to be loaded from any origin.  More about [other SVG injection methods][discarded].

### Icon coloring

The last point to cover in the summary is how icons get colored.  If the SVGs were directly embedded on the page, they could be colored with a simple CSS rule like `svg { fill: blue }`.  However, since we're including the SVGs remotely (via `<image xlink:href="URL">`), they can't be affected by the `fill` property.  There is another approach, which might sound a bit hacky, but it works well: SVG filters.  More about SVG filters for [coloring][coloring].


That's it for the summary!  Below are more thorough explanations of each part of the implementation.

---

## All about icon sets

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
    (icon, set, path) => `${path}/${icon}.svg`
);
```
Here are the arguments for the `addIconSet` function.

| arg name | arg type | arg description |
| --- | --- | --- |
| set name | String | the name of your icon set (cannot contain hyphens) |
| set path | String (a URL) | a fully qualified URL to the base directory of an SVG library |
| parseIconName | Function | a function that accepts (iconName, setName, setPath) and returns a URL to an SVG |

### parseIconName

In the example above, the parseIconName function is fairly simple, just stitching together `path`, `icon` and `.svg`.  This is possible because the directory structure of the imaginary SVG library is very simple.  For icon libraries where the directory structure or filename conventions are more complex, those complexities can be smoothed over with special logic in the parseIconName function, with the aim of retaining goal 4 (minimal syntax).  Goal 5 achieved.

### Organizing icon sets

Many icon libraries sort icons into logical sets.  Sets like "social network logos" or "road signs" are useful when searching for a specific icon.  However, when a logical set is bundled together, you wind up including a font on your page which includes *every* social network logo.

To avoid that, pfe-icon decouples **logical sets** from **delivery bundles**.  That's the main idea behind goal 1, and many of the implementation decisions (like not using a font to deliver icons).  Also, new icons should be put into the most logical set, without having to weigh how large the set is.  You should never be tempted to create a new, _illogical_ set, just to keep bundle size down.

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

## SVG &lt;image&gt; saves the day

After Safari's incompatibility forced me to move on from the most promising method ([CSS background image][css-bg]), I was stumped.  If SVG filters couldn't work inside Safari's Web Component implementation, would I have to give up and start from scratch?

I had some hunches about why SVG filters don't work in Safari shadow DOMs.  One hunch was something to do with the fact that each SVG has its own shadow DOM.  Another was that Safari was having trouble looking up the SVG by its `id`.  Perhaps it was doing a naive `document.body.getElementById` rather than looking inside the nearest shadow root, for example.  Perhaps both hunches are true and related somehow.

Anyway, I figured that if those hunches were true, the problem would disappear if the `<filter>` and the icon existed inside the same SVG element.  That led me to [`<image>`][svg-image], and when I tried it out, it worked perfectly.  Well, not in IE11, but everywhere else.

---

## Performance

Theoretically, performance should be very good due to fetching only the icons in use.  Theory doesn't always pan out though, so here are some reasons to feel optimistic about pfe-icon performance.

### Icon size

The built-in icons are in the 0.5-1.5 kB range (gzipped). Pretty <small>small</small>.

### HTTP

In the HTTP/1.1 days, making a separate HTTP request for each each SVG would have been a firm **No**, but HTTP/2 has changed that rule of thumb.

I ran a test on a sample page with 291 icons.  These HTTP request visualizations tell the story pretty well.

<figure>
<img alt="Noisy visualization of HTTP/1.1 requests for 291 icons." src="./http1.png">
<figcaption>HTTP/1.1</figcaption>
</figure>

<figure>
<img alt="Quiet visualization of HTTP/2 requests for 291 icons." src="./http2.png">
<figcaption>HTTP/2</figcaption>
</figure>

Apps that import and bundle icons during a build will probably still beat out pfe-icon, but I'm okay with that.  As a Web Component, pfe-icon can work anywhere, whereas build-time icons are less portable.

### Lighthouse

As for hard numbers, I ran a few quick [Lighthouse][lighthouse] tests on the sample page with 291 icons.  The results are very promising: 98/100.

These don't capture every performance metric, so more testing would be good to have.

---

## Browser support

Browser support is very good.  However, icon coloring doesn't work in Microsoft browsers (IE11 and Edge), so those browsers get monochrome icons.

![browser support thumbnails][browsers]

You can scan the full [gallery of screenshots][browser-gallery].

### Puzzler: MS Edge icon coloring

Something puzzling to note... while icon coloring doesn't work in Edge, it _did_.  I have a screenshot of colored icons in Edge on day I discovered the `<image>` method, but the next day it no longer worked.  I spent an entire day [bisecting][bisect] my commits, trying to figure out what changed, with no luck.  My best guess is that a different version of ShadyCSS made the difference.

---

## Recap

Icon sets are namespaced and can support any collection of SVGs by providing a custom [parseIconName][parseiconname] function, which maps concise icon names to URLs where each SVG can be found.

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
[parseiconname]: #parseiconname
[web-components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[font-awesome]: https://fontawesome.com/
[css-bg]: #css-background-image
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[bisect]: https://git-scm.com/docs/git-bisect
