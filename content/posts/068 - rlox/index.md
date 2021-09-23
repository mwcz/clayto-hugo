---
title: "Shaking Off the Rust 3: Rust Interpreter for Lox"
date: 2021-08-29T23:07:40-04:00
categories: Rust
Tags:
 -  programming
 -  rust
description: "Just sitting here, reading Crafting Interpreters, and implementing it in Rust."
thumbnail: thumb.jpg
mwc: 68
draft: true
---

 - in token_type.rs, the `ref` keyword for borrowing enum values, avoiding partial move
 - found that converting String to Chars and indexing into it with `nth` was the biggest perf cost. see ./flamegraph-when-chars-was-biggest-cost.svg
   - tried calling chars() just once instead of every time, but then found that `nth` consumes, so re-calling chars() was essential to the code working as intended.  while looking through the API I discovered Peekable iterators. woot.  trying that out.
 - Writing Interpreters in Rust https://rust-hosted-langs.github.io/book/introduction.html
 - Perf improvement, from tag perf0 to perf1 (still need to tag it, shortly after e32ab71), for 10k.lox went from 5s to 100ms.  in perf0 I was running String.chars() for every peek/match_nex/advance call, so something north of 100,000 times converting the 10,000 character String into a char iterator.  refactored it to convert the String to a Vec<char> once at the beginning, and then simply index into it.  I experimented with the Peekable trait for iterators, but decided it strayed too far from the book.  then achieved a somewhat lesser perf improvement by implementing Display for for Token and TokenType, instead of simply deriving debug and printing `{:?}`.
