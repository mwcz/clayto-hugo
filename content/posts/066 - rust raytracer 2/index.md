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

 - took a cruise through prng packages.  from rand, to wyhash+rand_core, to pure getrandom, and back to rand. might revisit wyhash later for performance, or pregenerate a list of random numbers (if it doesn't bulk up .wasm filesize too much).
 - returning Vec<Vec3<f64>> didn't work, flattened to Vec<f64>, it was easier than
   - could have read more about js-sys to figure out how to return a uin8clampedarray, but just wanted to get it working.
 - performance was terrible.  measured between 12x and 60x slower than native binary.
   - tried every optimization level, s, z, 0-3
   - is it caused by copying Vec<Vec3<f64>> data into a flat Vec<f64>?
   - WTF: rendering _while profiling_ with chrome devtools, it runs in ~840ms.  rendering without profiling, it runs at about 2250ms. still have no idea why.
   - thanks to demangled names, devtools flame chart is extraordinarily helpful in debugging wasm performance issues.
        ```
        [package.metadata.wasm-pack.profile.release.wasm-bindgen]
        demangle-name-section = true
        ```
   - the terrible performance seems to stem from random number generation.  when `rand` is used with wasm-bindgen, it calls into JS land `crypto.getRandomValues` to generate random numbers.  this accounted for 80% of the .
   - still have no idea why it ran so much faster _while profiling_.
   - looking for a fast rust-only prng.  does not need to be secure.[lehmer](https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/) looks good.  but to implement that we need a way to have a mutable variable at the top level of a rust module.  generators would be a fun way to go, but I don't see a way of making a pub generator.
   - even for rand, I was looking for a way to avoid creating a new rng every time random_float is called.  I want to try using the `cached` crate on a `get_rng` function to see if it properly memoizes it.  should speed things up nicely. can't get it to work with mut, and rngs must be mut.  rand wants to be unsafe.
   - trying a real bummer of an approach: initializing an rng in main() and passing it down the long waterfall of functions.  too awkward, giving up.
   - trying to improve performance by using lazy_static to create a mutex-protected global mut rng.
     - first try: lazy_static on a mut u128 and use ultra-fast [lehmer64](https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/)
     - second try: lazy_static on a mut u128 and use ultra-fast [wyhash64](https://lemire.me/blog/2019/03/19/the-fastest-conventional-random-number-generator-that-can-pass-big-crush/)
     - both are crazy fast but lehmer seems faster.
     - idea: try the above with u64 instead.  security is not needed here, speed is priority.
     - idea: try to parallelize the rng.  both lehmer and wyhash update the seed in one step, which must be synchronized, but after the seed update, the rest of the algorithm can be par.
   -
