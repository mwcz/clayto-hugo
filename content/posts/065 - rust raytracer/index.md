---
title: "Shaking Off the Rust 1: Ray Tracing in One Weekend"
date: 2021-02-08T22:38:50-05:00
categories: Rust
Tags:
 -  rust
 -  ray-tracing
description: "Learning Rust, one tetanus shot at a time.  In this post, I work on building a Ray Tracer in One* Weekend."
thumbnail: thumb.jpg
mwc: 65
draft: true
---

## WHY

Back in college, two classes stand out as my favorites from from NCSU's computer science curriculum.  One was x86 assembly (CSC 236).  The other was computer graphics (CSC 461), where we wrote a software rasterizer from scratch, as well as a ray tracer (which I never finished).

For the past 16 years, I've been working in web development, a space which I greatly enjoy, but through a mysterious matrix of psychological forces, I've started to regret losing touch with the more bare-metal areas of computer programming which had captured my interest so much in college.

When I heard that my favorite lecturer, Dana Lasher, who'd taught my x86 assembly course, was retiring from NCSU, I got the itch to embark on a low-level side project.

## WHAT

But what to do?  After some thought, there was only one choice.  It was time to finish the ray tracer I'd failed to complete in college.  In my bookmarks I dug up [Ray Tracing in One Weekend](https://raytracing.github.io/), a guide by Peter Shirley on writing ray tracers.  His example code is in C++, as was my incomplete ray tracer, but I didn't have much interest in revisiting C++.

<svg class="float-comp" height="144" width="144" xmlns="http://www.w3.org/2000/svg"><path d="m71.05 23.68c-26.06 0-47.27 21.22-47.27 47.27s21.22 47.27 47.27 47.27 47.27-21.22 47.27-47.27-21.22-47.27-47.27-47.27zm-.07 4.2a3.1 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm7.12 5.12a38.27 38.27 0 0 1 26.2 18.66l-3.67 8.28c-.63 1.43.02 3.11 1.44 3.75l7.06 3.13a38.27 38.27 0 0 1 .08 6.64h-3.93c-.39 0-.55.26-.55.64v1.8c0 4.24-2.39 5.17-4.49 5.4-2 .23-4.21-.84-4.49-2.06-1.18-6.63-3.14-8.04-6.24-10.49 3.85-2.44 7.85-6.05 7.85-10.87 0-5.21-3.57-8.49-6-10.1-3.42-2.25-7.2-2.7-8.22-2.7h-40.6a38.27 38.27 0 0 1 21.41-12.08l4.79 5.02c1.08 1.13 2.87 1.18 4 .09zm-44.2 23.02a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm74.15.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm-68.29.5h5.42v24.44h-10.94a38.27 38.27 0 0 1 -1.24-14.61l6.7-2.98c1.43-.64 2.08-2.31 1.44-3.74zm22.62.26h12.91c.67 0 4.71.77 4.71 3.8 0 2.51-3.1 3.41-5.65 3.41h-11.98zm0 17.56h9.89c.9 0 4.83.26 6.08 5.28.39 1.54 1.26 6.56 1.85 8.17.59 1.8 2.98 5.4 5.53 5.4h16.14a38.27 38.27 0 0 1 -3.54 4.1l-6.57-1.41c-1.53-.33-3.04.65-3.37 2.18l-1.56 7.28a38.27 38.27 0 0 1 -31.91-.15l-1.56-7.28c-.33-1.53-1.83-2.51-3.36-2.18l-6.43 1.38a38.27 38.27 0 0 1 -3.32-3.92h31.27c.35 0 .59-.06.59-.39v-11.06c0-.32-.24-.39-.59-.39h-9.15zm-14.43 25.33a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11zm46.05.14a3.11 3.11 0 0 1 3.02 3.11 3.11 3.11 0 0 1 -6.22 0 3.11 3.11 0 0 1 3.2-3.11z"/><path d="m115.68 70.95a44.63 44.63 0 0 1 -44.63 44.63 44.63 44.63 0 0 1 -44.63-44.63 44.63 44.63 0 0 1 44.63-44.63 44.63 44.63 0 0 1 44.63 44.63zm-.84-4.31 6.96 4.31-6.96 4.31 5.98 5.59-7.66 2.87 4.78 6.65-8.09 1.32 3.4 7.46-8.19-.29 1.88 7.98-7.98-1.88.29 8.19-7.46-3.4-1.32 8.09-6.65-4.78-2.87 7.66-5.59-5.98-4.31 6.96-4.31-6.96-5.59 5.98-2.87-7.66-6.65 4.78-1.32-8.09-7.46 3.4.29-8.19-7.98 1.88 1.88-7.98-8.19.29 3.4-7.46-8.09-1.32 4.78-6.65-7.66-2.87 5.98-5.59-6.96-4.31 6.96-4.31-5.98-5.59 7.66-2.87-4.78-6.65 8.09-1.32-3.4-7.46 8.19.29-1.88-7.98 7.98 1.88-.29-8.19 7.46 3.4 1.32-8.09 6.65 4.78 2.87-7.66 5.59 5.98 4.31-6.96 4.31 6.96 5.59-5.98 2.87 7.66 6.65-4.78 1.32 8.09 7.46-3.4-.29 8.19 7.98-1.88-1.88 7.98 8.19-.29-3.4 7.46 8.09 1.32-4.78 6.65 7.66 2.87z" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></svg>

Like a lot of programmers, I'd been keeping my eye on [Rust](https://www.rust-lang.org/) for the past few years, dabbling with it here and there.  Doing [Project Euler](https://projecteuler.net/) challenges, and fantasizing about writing blazing fast web applications, which would be effortlessly portable to the Web simply by targeting [WebAssembly](https://webassembly.org/) during compilation.  That last bit isn't quite turn-key yet, but Rust is a well-liked language, and one that checks a lot of boxes for me.



<style>
.float-comp {
  float: right;
  shape-margin: 1em;
}
.float-comp path {
  fill: rgb(220,44,12);
  stroke: rgb(220,44,12);
}
</style>



To start out, I dusted off my projects from the graphics course.  To my surprise, despite it being compiled on Linux Mint in 2009, the rasterizer still ran on Fedora 34 in 2021!

<div class="beside">
    <figure>
        <img src="./csc461/csc461_tor_sidebyside.png" alt="rasterizer running in 2009 on Linux Mint" loading="lazy" />
        <figcaption>My rasterizer on Linut Mint, 2009</figcaption>
    </figure>
    <figure>
        <img src="./csc461/csc461-fedora34.png" alt="rasterizer running in 2021 on Fedora 34" loading="lazy" />
        <figcaption>My rasterizer on Fedora 34, 2021</figcaption>
    </figure>
</div>

It looks like some new artifacts are present the 2021 render.  Bit rot, I guess. I'm just impressed that it ran at all, having been written on another distro, 12 years prior, by a complete novice at C++.

The ray tracer is another story.  I didn't even try running it again, partly because I'd never finished it, and partly because what I _did_ write was horribly inefficient.  Here are some screenshots for evidence.

<div class="beside">
    <figure>
        <picture>
          <source srcset="./csc461/test_view.avif" type="image/avif">
          <source srcset="./csc461/test_view.webp" type="image/webp">
          <img src="./csc461/test_view.jpg" alt="Expected result" loading="lazy">
        </picture>
        <figcaption>Reference image, the expected result</figcaption>
    </figure>
    <figure>
        <img src="./csc461/not_right_totally_wrong.png" alt='Imagine with a single pixel rendered, named "not right totally wrong dot png"' loading="lazy" />
        <figcaption>Day 1: Gotta start somewhere!</figcaption>
    </figure>
    <figure>
        <img src="./csc461/pass4.png" alt='a few more pixels'  loading="lazy"/>
        <figcaption>Day 2: I mean, there are more colored pixels so I guess that's an improvement.</figcaption>
    </figure>
    <figure>
        <img src="./csc461/overnight.png" alt='a speckled approximation of the expected result, named "overnight.png" because it took a ridiculous number of hours to complete' loading="lazy" />
        <figcaption>Day 3: Getting there!  Problem is, this file was named "overnight.png"... yikes.</figcaption>
    </figure>
</div>

Looking back, the "expected result" is a rasterized render, not a ray traced one.  Peculiar.  Maybe it was provided purely as a reference for what objects were in the scene.

Anyway, I ran out of time in part due to procrastination, and also due to the extremely long render times.  The final image above, `overnight.png`, is a tiny `200x130` pixel rendering, with spotty ray coverage, that took over 8 hours.  That's _including_ optimizations like a [kd-tree](https://en.wikipedia.org/wiki/K-d_tree) for spatial filtering.  That's how much I didn't (and still don't) understand efficient C++.  Charitably, you could call the performance _suboptimal_.

For comparison, my Rust ray tracer, whose only optimization is just trying to never copy data, took about the same amount of time to render this giganto:

<figure>
  <picture>
    <source srcset="./overnight-equivalent.avif" type="image/avif">
    <source srcset="./overnight-equivalent.webp" type="image/webp">
    <img src="./overnight-equivalent.jpg" alt='' loading="lazy" />
  </picture>
  <figcaption>16,000x10,666 pixels</figcaption>
</figure>

## CHALLENGES

### Programming with generic numbers

Writing functions for handling numeric types generically was a challenge I'd first encountered when dabbling in Rust with Project Euler problems.  For example, if I needed a function to test whether a number was prime, the function could accept an `u32`,

Luckily, I'd learned about [generics in Rust](https://doc.rust-lang.org/book/ch10-01-syntax.html) since then, so I figured there must be a way to define a function that could accept, say, "any floating-point type", or "any unsigned integer type", regardless of precision.  I set about looking for some [Traits](https://doc.rust-lang.org/book/ch10-02-traits.html) in the standard library.

I was surprised when my search came up empty.  What I did find is [num-traits](https://docs.rs/num-traits/0.2.14/num_traits/), a collection of "Numeric traits for generic mathematics".

After finishing the ray tracer, I noticed the lead maintainer of num-traits is a coworker of mine, fellow Red Hatter [Josh Stone](https://github.com/cuviper)! I reached out and thanked him for his work.  I also asked if he thought generic numeric traits would ever get folded into the Rust standard library, where I'd first gone looking.

He responded "Fun fact, they **came** from the standard library, pre Rust 1.0."

Apparently the traits had been pulled _out_ of standard library in preparation for Rust 1.0 because the Rust devs weren't ready to stabilize them yet.  Josh kept them stable since then.

He explained that stabilizing traits is tricky, because the rust compiler requires that all trait functions be implemented.  Take this pretend trait, `Fuzzy`, which pertains to the fuzziness of animals.  You can add functions with default implementations all day long without causing any breaking changes for anyone using your trait.

```rs
trait Fuzzy {
  fn fuzziness(&self) -> u32 {
    10
  }
}
```

But this default implementation doesn't make sense, because an animal's fuzziness is individual.  It really needs to be in an `impl` so it can be specific to the animal.

```rs
trait Fuzzy {
  fn fuzziness(&self) -> u32;
}

// elsewhere, in a user's codebase...

impl Fuzzy for Sheep {
}
```

Since there is no `impl` for the fuzziness function, the rust compiler will emit the following error.

<pre><code style="color: #ff5353">impl Fuzzy for Sheep {}
^^^^^^^^^^^^^^^^^^^^ missing `fuzziness` in implementation
</code></pre>

And that's why numeric traits don't exist in the Rust standard library.

### overriding arithmetic operators for vec3

got stuck on trying to add borrowed values.  it seemed to only work with owned values, which was very hard to work with.  problem unresolved.  went with function-based linear algebra.

### module system

detached from filesystem, very different mental model than what I'm used to

## CONCLUSION

 - got a Vec3 struct with impls for add, sub, mul, div, mag, mag_squared, normalize, and dot and cross product.  used mutating functions for most of them, so add adds to the existing vector instead of creating a new one.  not sure on the wisdom of that, but I assume it'll be faster.
 -
