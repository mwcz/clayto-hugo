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
     - idea: try wyhash crate again instead of reimplementing it.
     - whether I impl wyhash or use the crate, I'll need to convert uint to float in [0..1).
       - n = wyhash(starting_seed)
       - f(n) => n / mag( n )
       - mag(n) => int( log10( n )+1 )
     - implementing lehmer.  needed to allow integer overflow for u128.  discovered [Wrapping](https://doc.rust-lang.org/std/num/struct.Wrapping.html).
     - lazy_static worked for shared mut u128.  lehmer worked for prng.  Wrapping with >> worked for bit shift.  dividing by 2^64 worked for converting to float.  result: ~325ms, or 2.5x faster.  I expected 160ms, 5x faster.
     - floatuntidf (128-bit int support) is taking 18.5% of the time.  according to [compiler-buildins](https://github.com/rust-lang/compiler-builtins) it's a c library in the process of being ported to rust.  try using u64 instead of u128. result: runs in 180ms, really close to the 5x improvement that I expected after removing `rand`!
     - ## WWW: Web Workers Work.  trying to make an accurate spinner, but the wasm locks up the main thread, so I'm going to try putting it in a web worker.  module worker, specifically.  module worker worked.
       - except in Firefox, which doesn't support module workers.  the worker runs, but can't import, so I modified it to catch the error and return an error message to the main thread.  the main thread then responds by running the renderer on the main thread.  the timer can't tick up anymore because the  main thread is blocked, so I add a message to indicate what's happening.
     - ImageData is a supported type to pass to/from Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
   - after lazy_static and lehmer prng optimization, the time budget is dominated by the Sphere::hit detection, at 45% of runing time.  Ray::color is second at 19%, and lehmer prng is third at 18%.  I'm curious to see how this compares to the native performance profile.
 - for this post I tried something new which should have been obvious: keeping the notes open while working on the project and jotting.  typically I have two tmux panes open, one for nvim and one for running the program.  bumped it up to three.
