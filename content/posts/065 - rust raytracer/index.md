---
title: "Shaking Off the Rust 1: Ray Tracing in One Weekend"
date: 2021-02-08T15:38:50-05:00
categories: Rust
Tags:
 -  rust
 -  ray-tracing
description: "Learning Rust, one tetanus shot at a time.  In this post, I start working on the Ray Tracing in One Weekend guide."
thumbnail: thumb.jpg
mwc: 65
draft: true
---

WHY: TODO losing touch with low level programming

Back in college, my two favorite classes in the undergrad CS curriculum were CSC 236 (x86 assembly), and CSC 461 (computer graphics).  Since graduating 10 years ago, and even 6 years prior to that, I've been working in web development.

Some combination of nostalgia, the retirement last year of my favorite lecturer (Dana Lasher from NCSU), missing low-level stuff, listening to Jonathan Blow wax aggressively about web developers' lack of deep understanding of computers... sorry, trailed off there.  Anyway, for some reason I got the itch to try out Rust again.  I quickly realized that a _lot_ of my prior knowledge had atrophied severely, which motivated me to relearn as much as I can.

WHAT: TODO ray tracing in one weekend.  refer to raytracer written in college.

Back in the computer graphics class, one of our class projects was to write a raytracer in C++.

CHALLENGES
 - vec3 number traits, led to num-traits
 - overriding arithmetic operators for vec3, got stuck on trying to add borrowed values.  it seemed to only work with owned values, which was very hard to work with.  problem unresolved.  went with function-based linear algebra.
 - importing sibling modules, couldn't figure it out so kept everything in one file

CONCLUSION
 - got a Vec3 struct with impls for add, sub, mul, div, mag, mag_squared, normalize, and dot and cross product.  used mutating functions for most of them, so add adds to the existing vector instead of creating a new one.  not sure on the wisdom of that, but I assume it'll be faster.
 -
