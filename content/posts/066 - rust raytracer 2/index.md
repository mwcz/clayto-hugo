---
title: "Rust Raytracer to WebAssembly"
date: 2021-07-05T23:57:49-04:00
categories: Rust
Tags:
 - 3d
 - programming
 - ray-tracing
 - rust
 - web
 - wasm
description: "The work of preparing my Rust ray tracer for WebAssembly."
thumbnail: thumb.jpg
mwc: 65
draft: true
---

## RECAP

To set the scene, here's what was in place at the end of the [last post][prev].

 - one Rust ray tracer, runnable from the command-line only
 - an interest in WebAssembly
 - one mistaken assumption that could ruin everything


## I SET OUT TO...

This post covers getting that ray-tracer running in [WebAssembly][wasmorg].

## IT WENT...

The process of targeting WebAssembly went well, overall.  These were the highlights of the journey.

 - Refactored crates to support a CLI and WebAssembly module.

 - Fixed a staggering performance degradation caused by millions of excessive wasm-to-js calls.

 - Created a Rust implementation of a rather fast random number generator.

 - Was perplexed by performance tanking whenever devtools was open.

Before diving in too deep, here's the end result.  This is the ray tracer from my [previous post][prev], running right here in this blog post, at speeds pretty close to native.

<script async type="module" src="./rtw-render/dist/rtw-render.js"></script>

<style>
rtw-render {
  --rtw-background-color: var(--pbp-bg-color);

  border: 1px solid var(--pbp-fg-color);

}
</style>
<center>
<rtw-render></rtw-render>
</center>

## Crate refactoring

At the end of the previous post, the ray tracer was implemented in a single binary crate.  To re-use that code for a WebAssembly target as well, the first thing I did was move the ray tracing code into a library crate.

The original binary crate then imported the library crate, so the ray tracer can still be run on the command line.  I created a third "wasm" crate with [wasm-pack][wasm-pack], an outstanding tool.  The wasm crate also imports the library crate and exports a `render` function to JS with `#[wasm_bindgen]`.

In Rust land, the `render` function returns a `Vec<u8>`.  When `render` is called in JS land, the `Vec<u8>` looks like a `Uint8ClampedArray`.  That slots perfectly into an [`ImageData`][imagedata], which is then drawn into a `<canvas>` with [`putImageData()`][putimagedata].

With those changes, I had a working WebAssembly module.  Here's the first rendering.

![a screenshot of the very first WebAssembly rendering of my ray tracer](screenshots/first-wasm-render.png)

The quality settings were at rock bottom, but it was still pretty exciting!

But how is the performance?

## Performance

Initially, the performance of the WebAssembly module seemed pretty good.  The quality settings were at rock bottom to make the save/refresh loop tighter.  Once I turned the quality settings back up to their defaults, I was stunned.  The performance was awful.  The WebAssembly module ran **12x** slower than the native binary.  Under some conditions, I even saw it degrade to **60x** native speed.  I won't leave anyone in suspense though, WebAssembly's innate speed was not the cause.

Below I'll go into why the performance was so poor, where the bottlenecks were, and how I corrected them.

### Mangle shmangle

The first test I ran was a performance profile in Chrome devtools, which profiles JS and WebAssembly.  The results were... unhelpful.

![screenshot of the mangled names](screenshots/profile-mangled-names.png)

Adding the two following settings to the Cargo.toml resulted in more useful names.

```toml
[package.metadata.wasm-pack.profile.release]
wasm-opt = false

[package.metadata.wasm-pack.profile.release.wasm-bindgen]
demangle-name-section = true
```

<figure>
<img src="screenshots/profile-demangled-names.png" alt="screenshot of demangled names" />
<figcaption>
A more helpful profile with demangled names.
</figcaption>
</figure>

With the profile now usable, the bottleneck jumped off the screen.

![RNG was 80% of the cost](./screenshots/rng-eighty-percent.png)

`random_float`?  For some reason, generating random numbers taking up most of the oxygen in the room.

### RNGesus Giveth and Taketh Away

The profile revealed that 80% of the ray tracer's activity consisted of calls to [rand][rand], an RNG crate.  I'd chosen rand because it had WebAssembly support, and includes no calls to the standard library, which tends to cut down on `.wasm` file size.  What I hadn't noticed until digging into the flame chart, is that when rand is in the WebAssembly context, it makes calls out to JS (`crypto.getRandomValues()`).  And the way I was misusing rand, it was making _a lot_ of those calls.

RNG is needed throughout the ray tracer, and I didn't know of a way in Rust to create a single, global RNG that every corner of the program could make calls to.  Instead, I inefficiently initialized a new RNG every time a random number was needed.

This left me with two problems to solve.

 1. find a way to share a single RNG
 2. avoid JS calls

After some experimentation, I settled on implementing [lehmer64][lehmer64], and sharing it with [lazy_static][lazy_static].

**lib.rs**
```rust
use lazy_static::lazy_static;
use std:sync:Mutex;

lazy_static! {
    static ref RNG: Mutex<u128> = Mutex::new(0xda942042e4dd58b5);
}
```
Here's the [Rust implementation of lehmer64][rust-lehmer].  The starting seed is all that's shared, and it gets rewritten by each call to `random_float`.  After the compiler asked me (politely) to add [Wrapping][wrapping] to indicate that integer overflow was expected, the code worked.

Without the excessive wasm-to-js calls, performance improved.  But not as much as I expected.

The culprit, taking up 19% of total time, was [floatuntidf][floatuntidf].   It's a C floating point library.  According to [compiler-builtins](https://github.com/rust-lang/compiler-builtins), it's in the process of being ported to Rust.  My guess is that my conversion of `u128` to `f64` activated floatuntidf.  I lowered the precision to `u64/f32`, which made `Wrapping` and `floatuntidf` unnecessary.  That's a free 19% performance boost with no noticable change in image quality.

When this fell into place, the WebAssembly module's speed was breathing down the neck of native!  In this test, WebAssembly runs at 1.13x native speed.

| Average total time | Standard deviation |
| --- | --- |
| 399.20 ms | ± 4.30 ms |
| 452.05 ms | ± 10.85 ms |

Native measurements were captured over 30 runs with [hyperfine][hyperfine].  WebAssembly measurements were captured over 30 runs with the Chrome devtools profiler.

Only 1.13x native speed, not bad!  That's within the range I've heard to expect from WebAssembly.  Under other conditions I've seen the WebAssembly module perform worse.  1.5x native speed seems like the worst case, and 1.13x is the best case for my particular module.  The comparison still may not be perfectly fair to the WebAssembly module though, because its measurements are taken with profiling active which surely impacts performance somewhat.


#### Overheated Mutex

One piece of low-hanging fruit that I haven't pruned yet is the Mutex from the code snippet above, which gets extremely overheated. It's used to share mutable access to the RNG seed.  Random numbers are needed throughout the ray tracer, and several are generated per ray.  The quantity of random numbers generated can easily reach into the millions or billions.

The frantic locking and unlocking of the Mutex takes a lot of time.  There's probably a better synchronization technique, but I have a lot to learn about concurrency.

I did eke out a 22% performance gain by replacing `std` Mutex with [spin-sync][spin-sync] Mutex.  It still gets overheated, taking about 20% of total time, but that's still 22% better than `std` Mutex.  spin-sync's Mutex also reduced the size of the `.wasm` module by 2kb, so that's a small win too.  The final gzipped size is around 20-30kb, depending on optimization settings.

Here's the performance profile as it currently stands.

<small>

<!-- https://gohugo.io/content-management/syntax-highlighting/ -->
{{< highlight text "hl_lines=3-4" >}}
1,323,563,733 (38.60%)  ???:<rtw::objects::sphere::Sphere<T> as rtw::hit::Hittable<T>>::hit
  537,820,968 (15.68%)  ???:rtw::random::random_float
  370,075,224 (10.79%)  ???:pthread_mutex_lock [/usr/lib64/libpthread-2.33.so]
  319,030,423 ( 9.30%)  ???:pthread_mutex_unlock [/usr/lib64/libpthread-2.33.so]
  274,479,530 ( 8.00%)  ???:rtw::ray::Ray<T>::color'2
  213,215,525 ( 6.22%)  ???:rtw::ray::Ray<T>::color
  129,769,989 ( 3.78%)  ???:cli::main
  104,789,656 ( 3.06%)  ???:<rtw::material::lambertian::Lambertian<T> as rtw::material::Material<T>>::scatter
   49,099,401 ( 1.43%)  ???:<rtw::RNG as core::ops::deref::Deref>::deref
   45,736,164 ( 1.33%)  ???:<rtw::material::dielectric::Dielectric<T> as rtw::material::Material<T>>::scatter
   31,644,376 ( 0.92%)  ???:<rtw::material::metal::Metal<T> as rtw::material::Material<T>>::scatter
{{< / highlight >}}

</small>

There's still low-hanging fruit I'd like to practice optimizing later.  This post is focusing on closing the gap between the WebAssembly module and native, which was pretty successful with only a 13% performance difference.

With more time, I'd like to remove the lazy_static/Mutex approach in favor of something that doesn't overheat so badly.  I may take the time to simply pass a mutable seed reference down into every corner of the program.  Argument drilling like that is extremely tedious, but it would obviate the need for the Mutex.  Maybe someone can show me a better way to do that in Rust.

Also, Sphere intersection (`Hittable<T>::hit`) sits conspicuously at the top of the list, taking up 38.6% of total time.  That could possibly be lowered with spatial filtering (my university ray tracer used a kd-tree), or some geometric shortcuts.

#### Reduce, reuse, recycle ♻

Here's a fun misadventure to share.  To solve the RNG performance problem, I experimented with hard-coding a set of pre-computed random numbers, and then cycling through them over and over again.  I figured &mdash;this isn't exactly cryptography&mdash; if the set was big it would be good enough for bouncing rays around.


<figure>
<img src="screenshots/raytrace-0.31-fake-rng.png" alt="ray tracing seeded by 100 recycled &quot;random&quot; numbers" />
<figcaption>100 precomputed "random" numbers.</figcaption>
</figure>

The results with 100 numbers were were about as poor as I expected, so I bumped it up to 10,000.

<figure>
<img src="screenshots/raytrace-0.7381-fake-rng.png" alt="ray tracing seeded by 10,000 recycled &quot;random&quot; numbers" />
<figcaption>10,000 precomputed "random" numbers.</figcaption>
</figure>

10,000 gave better results than 100, suggesting the approach could work with a large enough set, but 10,000 was already causing noticeable bloat in the size of the `.wasm` file, so I pressed _undo_ a bunch of times and vowed never to speak of this again.



#### Slow performance when devtools is open

My initial disappointment at the slow performance was compounded by the fact that WebAssembly runs significantly slower when the devtools panel is open.  By slower, I mean from 2x to 4x slower.  At one point, the ray tracer ran in 840ms with devtools closed, and 2250ms with it open, 2.6x slower.

In all the JS games I've built, I've never noticed a performance hit from having from devtools open, so I was surprised to see WebAssembly take a hit.  I took to Twitter to find out why. At [@rictic](https://twitter.com/rictic/)'s suggestion, I opened a Chromium [ticket](https://bugs.chromium.org/p/chromium/issues/detail?id=1230610).

The response from the Chromium team was that this is expected behavior because of something called a "Liftoff tier".  "What is a Liftoff tier?" I wondered.  The v8 blog has the answer: [Liftoff](https://v8.dev/blog/liftoff) is a streaming compiler that can initialize a wasm module very quickly, and TurboFan is an optimizing compiler which initializes more slowly, but produces much faster code.  With devtools open, WebAssembly runs exclusively in the Liftoff tier.  Without devtools, WebAssembly will be first initialized with Liftoff so it can begin execution quickly, then individual functions will be gradually replaced with TurboFan-optimized ones.

Liftoff allows deeper inspection, which is why it's active with devtools.

The answer surprised me in one area.  Even though I'm not accustomed to slowdowns from devtools, I do expect a performance hit from profiling.  But to my astonishment, the speed returns to normal _while the profiler is running_.

It's less strange than I first thought, because one thing the profiler does _not_ do is process breakpoints.  Furthermore, the debugger is disabled while profiling for both JS and WebAssembly.  While profiling, WebAssembly seems to be elevated to the faster TurboFan tier, which must accomodate enough inspection to profile, but not to debug.  Thank goodness, because that seems like the tier in which it's most useful to optimize.

The more you know.

## What's next



[wasm-pack]: https://rustwasm.github.io/wasm-pack/book/introduction.html
[generic-correction]: https://www.reddit.com/r/rust/comments/ocaiwb/there_are_many_like_it_but_this_one_is_my_rust/h3wjlf4/?utm_source=reddit&utm_medium=web2x&context=3
[fruitiex]: https://www.reddit.com/user/FruitieX/
[lehmer64]: https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/
[lazy_static]: https://crates.io/crates/lazy_static
[rand]: https://crates.io/crates/rand
[rust-lehmer]: https://github.com/mwcz/rust-raytracer-weekend/blob/wasm/lib/src/random.rs
[floatuntidf]: https://github.com/libdfp/libdfp
[wrapping]: https://doc.rust-lang.org/std/num/struct.Wrapping.html
[wasmorg]: https://webassembly.org/
[flamegraph]: https://github.com/flamegraph-rs/flamegraph
[hyperfine]: https://github.com/sharkdp/hyperfine
[prev]: {{< relref "../065 - rust raytracer/index.md" >}}
[imagedata]: https://developer.mozilla.org/en-US/docs/Web/API/ImageData
[spin-sync]: https://crates.io/crates/spin-sync
[putimagedata]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
