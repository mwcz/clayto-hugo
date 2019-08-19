---
title: "Web Component Icons"
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

This is the story of `pfe-icon`, a web component for displaying icons which loads icons on demand and is compatible with any existing set of SVGs.  It is part of the [PatternFly Elements][pfe] project.

---

{{< toc >}}

---

<style>
.icon-panel {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  justify-items: center;
}
body {
  --pfe-icon--Color: var(--pbp-fg-color, white);
}
</style>

## Demo

**Red Hat icons:**

| Icon | Markup |
| --- | --- |
| <pfe-icon style="--pfe-icon--Color: #CE393C" size="xl" icon="rh-aed"></pfe-icon> | `<pfe-icon icon="rh-aed"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #F39A42" size="xl" icon="rh-sun"></pfe-icon> | `<pfe-icon icon="rh-sun"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #56BD58" size="xl" icon="rh-leaf"></pfe-icon> | `<pfe-icon icon="rh-leaf"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #8E59CB" size="xl" icon="rh-puzzle-piece"></pfe-icon> | `<pfe-icon icon="rh-puzzle-piece"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, #6FA5F2)" size="xl" icon="rh-space-rocket"></pfe-icon> | `<pfe-icon icon="rh-space-rocket"></pfe-icon>` |

**Font Awesome icons:**

| Icon | Markup |
| --- | --- |
| <pfe-icon style="--pfe-icon--Color: #CE393C"  size="xl" icon="fab-redhat"></pfe-icon>                    | `<pfe-icon icon="fab-redhat"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #F39A42"  size="xl" icon="fab-accessible-icon"></pfe-icon>           | `<pfe-icon icon="fab-accessible-icon"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #56BD58"  size="xl" icon="far-eye"></pfe-icon>                      | `<pfe-icon icon="far-eye"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: #8E59CB"  size="xl" icon="far-grin-hearts"></pfe-icon>              | `<pfe-icon icon="far-grin-hearts"></pfe-icon>` |
| <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, #6FA5F2)" size="xl" icon="far-envelope"></pfe-icon> | `<pfe-icon icon="far-envelope"></pfe-icon>` |


---

## Features



 - **On-demand icon loading** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  icon="fas-concierge-bell"></pfe-icon>
 - **No CORS restrictions** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  icon="fas-share"></pfe-icon>
 - **Icon coloring** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  icon="fas-palette"></pfe-icon>
 - **Concise syntax** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  icon="fas-ruler-horizontal"></pfe-icon>
 - **Icon sets** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  icon="fas-object-group"></pfe-icon>

This post walks through how the features above were implemented.

---

## The pfe-icon tag

Here's a typical pfe-icon tag.

```html
<pfe-icon icon="rh-server"></pfe-icon>
```
Result: <pfe-icon size=xl icon="rh-server"></pfe-icon>

While it would have been nice if pfe-icon could have a self-closing tag, Custom Elements can't be self-closing (only a small set of "[void elements][void]" can).  Other than that, the syntax above is nice and minimal.

**Concise syntax**: <pfe-icon style="--pfe-icon--Color: green" icon="fas-check">check</pfe-icon>

Next, let's see how a simple icon name like `rh-server` is handled by pfe-icon.

## Icon sets

When pfe-icon sees `icon="rh-server"` the first thing it does is figure out what icon set it belongs to.  Whatever comes before the first `-` is the name of the icon set.  Following that rule, we find the icon set is `rh`.  Only the first `-` is significant; for example, the name `rh-construction-hard-hat` represents icon `construction-hard-hat` inside an icon set named `rh`.

Icon set namespacing (part of goal 5) achieved.

At this point, pfe-icon knows the icon name and the set it belongs to, but doesn't know yet where to get the SVG.  That brings us to icon set definitions.


### Icon set definitions

pfe-icon can be used with any set of SVGs, no matter what directory structure or naming conventions are used.  Icon sets provide the mechanism for this broad reach.

When defining an icon set, you provide three bits of information, the set's name, a base URL to the SVGs, and a `resolveIconName` function  which maps icon names to the SVG's URL.

Here's an example.  Let's say we have some SVGs hosted at `https://foo.com/svgs`. Listing the `svgs` directory would look like this:

```
https://foo.com/svgs/
├── horse.svg
├── battery.svg
├── staple.svg
└── coconut.svg
```

Here's how to define an icon set to make pfe-icon compatible with our SVGs.

Oh yeah, let's call the icon set "foo".

```js
import PfeIcon from "@patternfly/pfe-icon";

PfeIcon.addIconSet(
    "foo",
    "https://foo.com/svgs",
    (iconName, setName, path) => `${path}/${iconName.replace("foo-", "")}.svg`
);
```
Here are the arguments for the `addIconSet` function, in order.

| arg | type | description |
| --- | --- | --- |
| set name | String | the name of your icon set (cannot contain hyphens) |
| set path | String (a URL) | a URL to the base directory[^1] of an SVG library |
| resolveIconName | Function | a function that accepts (iconName, setName, setPath) and returns a URL to an SVG |

#### resolveIconName

The heart of pfe-icon's extensibility is `resolveIconName`.  It's a custom function which turns a lucid, human-friendly name like "foo-horse" into a URL where pfe-icon can fetch the corresponding SVG.

After creating our "foo" icon set, we can display a horse icon.

```html
<pfe-icon icon="foo-horse"></pfe-icon>
```

Let's look again at the return value of our set's resolveIconName function.

```js
`${path}/${iconName.replace("foo-", "")}.svg`
// For reference, here are the values of the variables
// path = "https://foo.com/svgs"
// iconName = "foo-horse"
```

The result, `https://foo.com/svgs/horse.svg`, is the correct URL to the horse icon.

The simplicity of this function reflects the simplicity of the directory structure in the example.  For icon libraries where the directory structure or filename conventions are more complex, those complexities can be smoothed over with special logic in the resolveIconName function, allowing icon names to stay relatively concise.

For example, if your SVGs have names like "foo-icon-horse.svg", it's still possible to have icon names like "foo-horse" by teaching your resolveIconName function to inject the `-icon` when generating URLs.  Whatever set of SVG icons you have, you can write a `resolveIconName` function that translates friendly icon names into full URLs, no matter what naming conventions the icon library has.

Enough imaginary examples.  Let's integrate pfe-icon with a third-party icon library!

### Integrating with Font Awesome

For this blog post, I wanted to demonstate using pfe-icon with a third-party icon library.  Font Awesome is a popular choice, and offers icons in SVG format (among others).  Font Awesome icons are separated into three categories: regular, solid, and brands.  Font Awesome's CSS/JS provides a CSS class-based approach to adding icons.  For example, to add a carrot to your page, you would write `<i class="fas fa-carrot"></i>`.  I wanted to stay pretty close to that naming convention, but the two class names didn't fit well with pfe-icon's single `icon` attribute, so I shortened the identifier to `fas-carrot`.

The "s" in "fas" stands for "solid", one of Font Awesome's icon categories.  Here are all three.

| Category | FA syntax | pfe-icon syntax | icon |
| --- | --- | --- | --- |
| brands | `class="fab fa-d-and-d"` | `icon="fab-d-and-d"` | <pfe-icon size=lg icon="fab-d-and-d"></pfe-icon> |
| regular | `class="far fa-eye"` | `icon="far-eye"` | <pfe-icon size=lg icon="far-eye"></pfe-icon> |
| solid | `class="fas fa-carrot"` | `icon="fas-carrot"` | <pfe-icon size=lg icon="fas-carrot"></pfe-icon> |

Here's the icon set definition I created for the _solid_ category.  It creates an icon set named `fas` and sets a base path of `/icons/font-awesome/solid`.

```js
PfeIcon.addIconSet(
  "fas",
  "/icons/font-awesome/solid",
  (iconName, setName, path) => {
    const name = iconName.replace("fas-", "");
    return `${path}/${name}.svg`;
  }
);
```

The resolveIconName function (third argument) is fairly simple; it removes the `fas-` prefix from the icon name, prepends the base path, and appends `.svg`.  For example, it maps `fas-carrot` to [`/icons/font-awesome/solid/carrot.svg`](/icons/font-awesome/solid/carrot.svg).

### Organizing icon sets

Many icon libraries sort icons into logical sets.  Sets like "social network logos" or "road signs" are useful when you're trying to find a specific icon.  However, when a logical set is bundled together, you wind up including a font on your page which includes *every* social network logo.

To avoid downloading icons that aren't needed, pfe-icon's philosophy is to decouple **logical sets** from **delivery bundles**.  If you are organizing an icon set, and know it will be delivered with pfe-icon, you'll never have to weigh how large the set is when choosing where to put a new icon.  You should never be tempted to create a new, _illogical_ set, just to keep bundle size down.

---

## SVG injection and coloring

There are innumerable ways to get an SVG onto a webpage and each comes with its own quirks.  After exploring most of them, here is the method that best fits pfe-icon's requirements.


Inside pfe-icon's shadow root is a single SVG.  The SVG has an `<image>` and a `<filter>`.  The URL emitted from resolveIconName is given to the `<image>`, which fetches and displays the SVG without CORS requirements.  The `<filter>` handles coloring.  Here's what the SVG looks like.

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="color-filter" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
    <feFlood result="COLOR" />
    <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
  </filter>
  <image xlink:href="{{ SVG URL HERE }}" filter="url(#color-filter)" width="100%" height="100%"></image>
</svg>
```


There were many considerations that went into picking this approach for injecting SVGs, but the biggest one is that this approach allows SVGs to be loaded from any origin.  A follow-up post has more about [other SVG injection methods][discarded].

After Safari's incompatibility forced me to move on from the most promising method ([CSS background image][css-bg]), I was stumped.  If SVG filters couldn't work inside Safari's Web Component implementation, would I have to give up and start from scratch?

I had some hunches about why SVG filters don't work in Safari shadow DOMs.  One hunch was something to do with the fact that each SVG has its own shadow DOM.  Another was that Safari was having trouble looking up the SVG by its `id`.  Perhaps it was doing a naive `document.body.getElementById` rather than looking inside the nearest shadow root, for example.  Perhaps both hunches are true and related somehow.

Anyway, I figured that if those hunches were true, the problem would disappear if the `<filter>` and the icon existed inside the same SVG element.  That led me to [`<image>`][svg-image], and when I tried it out, it worked perfectly.  Well, not in IE11, but everywhere else.

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

[^1]: icon set URLs must have absolute paths, ie `/foo` or `http://foo.com/foo` but not `../foo` or `foo`

[pfe]: http://patternfly.org/patternfly-elements
[icon-sets]: #all-about-icon-sets
[discarded]: {{< ref "062 - how not to make svg icons/index.md" >}}
[coloring]: #svg-injection-and-coloring
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
