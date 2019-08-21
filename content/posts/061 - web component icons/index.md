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

<style>
pfe-icon {
  --pfe-icon--Color: var(--pbp-fg-color, white);
}
@media (min-width: 750px) {
  #TableOfContents {
    float: right;
    padding: 10px;
    /* margin: 10px; */
    margin: 0 0 20px 20px;
    background-color: #242424;
  }
}
</style>

{{< toc >}}

This is the story of `<pfe-icon>`.  I set out to build a web component which loads icons on demand, displays them with customizable colors, avoids CORS issues, and is compatible with any existing SVG icon library.  pfe-icon is part of the [PatternFly Elements][pfe] project.

<center>
<pfe-icon style="--pfe-icon--Color: #CE393C"  size="xl" icon="fab-redhat"></pfe-icon>
</center>

---

## Features

 - **On-demand icon loading** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  title="concierge bell" icon="fas-concierge-bell"></pfe-icon>
 - **No CORS restrictions** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  title="share icon" icon="fas-share"></pfe-icon>
 - **Icon coloring** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  title="palette" icon="fas-palette"></pfe-icon>
 - **Concise syntax** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)"  title="ruler" icon="fas-ruler-horizontal"></pfe-icon>
 - **Compatible with all icon libraries** <pfe-icon style="--pfe-icon--Color: var(--pbp-blue, white)" title="category icon" icon="fas-object-group"></pfe-icon>

This post describes how to use pfe-icon and how its features are implemented.  But first, a demo!

---

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

## The pfe-icon tag

One aim of pfe-icon is to have a tag that's fairly easy to type.  Here's a typical pfe-icon tag.

```html
<pfe-icon icon="rh-leaf"></pfe-icon>
```

Not bad.  It's short enough to type from memory.  Also while it would have been nice if pfe-icon could have a self-closing tag, Custom Elements can't be self-closing (only a small set of "[void elements][void]" can).

**Concise syntax**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>

Next, let's see how a simple icon name like `rh-server` is handled by pfe-icon.

## Icon sets

When pfe-icon sees `icon="rh-server"` the first thing it does is figure out what icon set it belongs to.  Whatever comes before the first `-` is the name of the icon set.  Following that rule, we find the icon set is `rh`.  Only the first `-` is significant; for example, the name `rh-construction-hard-hat` represents icon `construction-hard-hat` inside an icon set named `rh`.

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

Let's look again at the return value of our set's resolveIconName function. For reference, the variables in the function have the following values: `path = "https://foo.com/svgs"` and `iconName = "foo-horse"`

```js
`${path}/${iconName.replace("foo-", "")}.svg`
```

The result, `https://foo.com/svgs/horse.svg`, is the correct URL to the horse icon.

The simplicity of this function reflects the simplicity of the directory structure in the example.  For icon libraries where the directory structure or filename conventions are more complex, those complexities can be smoothed over with special logic in the resolveIconName function, allowing icon names to stay relatively concise.

For example, if your SVGs have names like "foo-icon-horse.svg", it's still possible to have icon names like "foo-horse" by teaching your resolveIconName function to inject the `-icon` when generating URLs.  Whatever set of SVG icons you have, you can write a `resolveIconName` function that translates friendly icon names into full URLs, no matter what naming conventions the icon library has.


resolveIconName is the key to many of pfe-icon's features.  Let's check them off the list.

**Compatible with all icon libraries**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>
<br>
**On-demand icon loading**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>
<br>
**Concise syntax**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>

Enough imaginary examples.  Let's integrate pfe-icon with a real third-party icon library!

### Integrating with Font Awesome

For this blog post, I wanted to demonstate using pfe-icon with a third-party icon library.  Font Awesome is a popular choice, and offers icons in SVG format (among others).  Font Awesome icons are separated into three categories: regular, solid, and brands.  Font Awesome's CSS/JS provides a CSS class-based approach to adding icons.  For example, to add a carrot to your page, you would write `<i class="fas fa-carrot"></i>`. The "s" in "fas" stands for "solid", one of Font Awesome's icon categories.  The categories are: brands, regular, and solid.


I wanted to stay pretty close to Font Awesom'es naming convention, but having two class names didn't mesh well with pfe-icon's single `icon` attribute, so I shortened "fas fa-carrot" to "fas-carrot".  Here are a few more examples.


<center>

| Category | FA syntax | pfe-icon syntax | icon |
| --- | --- | --- | --- |
| brands | `fab fa-d-and-d` | `fab-d-and-d` | <pfe-icon size=lg icon="fab-d-and-d"></pfe-icon> |
| regular | `far fa-eye` | `far-eye` | <pfe-icon size=lg icon="far-eye"></pfe-icon> |
| solid | `fas fa-carrot` | `fas-carrot` | <pfe-icon size=lg icon="fas-carrot"></pfe-icon> |

</center>

To make it real, I created icon sets for each category, "fab", "far", and "fas".  They're almost identical to each other, so here's just one example.  This code creates an icon set named `fas` and sets a base path of `/icons/font-awesome/solid`.

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

If you'd like to see the icon set definitions for all three Font Awesome categories, see [pfe-icon-fa.js](./pfe-icon-fa.js).

### Organizing icon sets

When there isn't a third-party icon set that meets your needs, you may need to build your own set of icons.  When doing so, it can be helpful to categorize your icons.

Most icon libraries sort icons into logical sets.  Sets like "social network logos" or "road signs" are useful when you're trying to find a specific icon.  However, when a logical set is bundled, you wind up including a font on your page which includes *every* social network logo.

To avoid downloading icons that aren't needed, pfe-icon's philosophy is to decouple **logical sets** from **delivery bundles**.  If you are adding a new icon to your library, and know it will be delivered with pfe-icon, you'll never have to think "Wow, this set has gotten really big, maybe I'll find a different home for this new icon..."

You should never be tempted to create a new, _illogical_ set, just to keep bundle size down.

Whew, that was a long description.  Icon sets are the core of pfe-icon's extensibility.

**Icon sets**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>

Next, let's look at SVG injection and colorization.

---

## SVG injection and coloring

There are innumerable ways to get an SVG onto a webpage and each comes with its own quirks.  After exploring most of them, here is the method that best fits pfe-icon's requirements.

Inside pfe-icon's shadow root is a single SVG.  The SVG has an [`<image>`][svg-image] and a [`<filter>`][svg-filter].  The URL emitted from resolveIconName is given to the `<image>`, which fetches and displays the SVG without requiring CORS (no CORS: <pfe-icon style="--pfe-icon--Color: green" icon="fas-check">check</pfe-icon>).  The `<filter>` handles coloring.  Here's what the SVG looks like.

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="color-filter" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
    <feFlood result="COLOR" />
    <feComposite operator="in" in="COLOR" in2="SourceAlpha" />
  </filter>
  <image xlink:href="{{ SVG URL HERE }}" filter="url(#color-filter)" width="100%" height="100%"></image>
</svg>
```


There were many considerations that went into picking this approach for injecting SVGs, but the biggest one is that this approach allows SVGs to be loaded from any origin.  I'm working on a follow-up post about why other SVG injection methods didn't work out. <!-- [other SVG injection methods][discarded].-->

The summary for why I went with this approach for SVG injection and coloring all comes down to Safari support.  With `fill` unavailable, the only way to color icons is a CSS+SVG filter.  However, Safari was unable to apply the filter even when the `<filter>` and the `<img>` were in the same shadow root.  After trying several more obvious options, I tried moving them both inside the same SVG (and swapping HTML's `<img>` for SVG's `<image>`), and it worked.

### Setting icon colors

Defining the color to apply to a pfe-icon is as easy as setting a CSS variable.  The name of the variable is `--pfe-icon--Color`.  PatternFly Elements also has a theming layer,

You can set the color of individual icons, all icons, or discrete groups of icons.  The only limitation is that overriding `--pfe-icon--Color` must be applied directly to the pfe-icon elements, not to a container.  For instance, overriding it on `body` will not work.

On to the examples!

#### Coloring individual icons

```html
<style>
.green-icon {
  --pfe-icon--Color: green;
}
</style>

<pfe-icon class="green-icon" icon="rh-leaf"></pfe-icon>
```

`style` attributes work as well.

```html
<pfe-icon style="--pfe-icon--Color: green" icon="rh-leaf"></pfe-icon>
```

#### Coloring all icons

```html
<style>
  pfe-icon {
    --pfe-icon--Color: green;
  }
</style>
```

#### Coloring groups of icons

```html
<style>
.green-icons pfe-icon {
  --pfe-icon--Color: green;
}
</style>

<div class="green-icons">
  <pfe-icon icon="rh-leaf"></pfe-icon>
  <pfe-icon icon="rh-leaf"></pfe-icon>
  <pfe-icon icon="rh-leaf"></pfe-icon>
  <pfe-icon icon="rh-leaf"></pfe-icon>
</div>
```

PatternFly Elements also has a theming layer which can influence icon colors.  Documentation for the theming layer is in progress.

**Icon coloring**: <pfe-icon style="--pfe-icon--Color: green" aria-label="check" icon="fas-check">check</pfe-icon>

### Puzzler: MS Edge icon coloring

In the [browser support][browser-support] section, you'll see that icons are rendered as black and white in IE11 and Edge.  The odd thing is, at one point icon coloring *did* work in Edge.  I swear.  I have a screenshot of colored icons in Edge on day I discovered the `<image>` element, but the next day it no longer worked.  I spent an entire day [bisecting][bisect] my commits, trying to figure out what changed, with no luck.  My only guess is that a minor version change in ShadyCSS is to blame.  In the end, icon coloring in Edge was not important enough to spend more time on it.  Edge's days are numbered.

---

## Performance

Theoretically, performance should be very good due to fetching only the icons in use.  Theory doesn't always pan out though, so here are some reasons to feel optimistic about pfe-icon performance.

### Icon size

Icon SVGs tend to be less than 1 kB when gzipped.  Pretty small.  Meanwhile, including Font Awesome's three categories (let's say you needed one icon from each category) would cost 372.1 kB (gzipped).

### HTTP/1.1 vs HTTP/2

pfe-icon fetches SVGs on-demand.  In the HTTP/1.1 days, making a separate HTTP request for each each SVG would have been an unequivocal dealbreaker, but HTTP/2 has changed that rule of thumb.

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

As for hard numbers, I ran a few quick [Lighthouse][lighthouse] tests on the sample page with 291 icons.  The results are very promising, with pfe-icon scoring 98/100 in the performance category.

There are always more performance axes to measure.  The initial results are very promising, but more testing would be good to have.

---

## Browser support

Browser support is very good.  The last several years of desktop and mobile browsers are supported.  However, icon coloring doesn't work in Microsoft browsers (IE11 and Edge), so pfe-icon falls back to monochrome icons in those browsers.


<figure>
<img src="https://user-images.githubusercontent.com/364615/61894462-7f1b9e80-aede-11e9-8c8a-cb403927fb09.png" alt="browser support thumbnails">
<figcaption>
<a href="https://imgur.com/a/waA2ssx">Gallery of browser support screenshots</a>
</figcaption>
</figure>

---

## Recap

pfe-icon is a Web Component for displaying icons.  It's compatible with all existing SVG icon libraries, has no CORS restrictions, and supports coloring icons.

You can find pfe-icon on [<pfe-icon size=md style="--pfe-icon--Color: #FD3B45"  icon="fab-npm">npm</pfe-icon>][npm] and on [<pfe-icon style="--pfe-icon--Color: #f1f1f1" icon="fab-github-alt">github</pfe-icon>][repo].

[Give it a try][getting-started] and let us know what you think of pfe-icon and the rest of the PatternFly Elements project!


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
[svg-filter]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter
[resolveiconname]: #resolveiconname
[web-components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[font-awesome]: https://fontawesome.com/
[css-bg]: #css-background-image
[lighthouse]: https://developers.google.com/web/tools/lighthouse/
[bisect]: https://git-scm.com/docs/git-bisect
[void]: https://html.spec.whatwg.org/multipage/syntax.html#void-elements
[browser-support]: #browser-support
[repo]: https://github.com/patternfly/patternfly-elements/tree/master/elements/pfe-icon
[npm]: https://www.npmjs.com/package/@patternfly/pfe-icon
[getting-started]: https://patternfly.github.io/patternfly-elements/getting-started/
