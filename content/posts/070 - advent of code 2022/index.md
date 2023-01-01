---
title: "Advent of Code 2022"
date: 2022-12-25
Tags:
 -  programming
 -  rust
description: "Solving Advent of Code 2022 with Rust."
thumbnail: thumb.png
mwc: 70
draft: true
---

## Day 16

53 valves.

Permutations: 4,274,883,284,060,025,564,298,013,753,389,399,649,690,343,788,366,813,724,672,000,000,000,000

Disappear each 0-rated valve into its adjoining edges.  Now there are 15 valves.

Permutations: 1,307,674,368,000

One last step I took was to remove all the edges between nodes complete, and then connect every node to every other node with new edges that reflect the shortest distance between them (enabled by [petgraph](https://crates.io/crates/petgraph)'s [Floyd-Warshall](https://docs.rs/petgraph/latest/petgraph/algo/floyd_warshall/fn.floyd_warshall.html) implementation).

The main reason for that change was to avoid having to do any more pathfinding during the cost analysis portion of the solution.

I saw several redditors saying they tried simulating the human and elephant movements but eventually abandoned it because it was too hard to keep them in sync.  So naturally, I neglected learn from their mistakes and tried that next.

Here's my recursive function for simulating the human and elephant.  While the code is messy, I was able to get it working, but found it to be far too slow.  The reason it was too slow seems to be that the total path length of both players is too long, considering the factorial permutations.

https://github.com/mwcz/advent-of-code-2022/blob/d57d4569c83974ecd1989e45315396b3058a11b2/src/day16.rs#L194-L325

It's much cheaper to forget the human, and forget the elephant.  Find the scores for every possible path (and subpath) that a single "player" can travel in 26 minutes.  For every pair of paths that don't contain any common valves (ie, disjoint sets), add their scores together.  Then find the highest score.  Those two paths are the paths the elephant and human should take.


## Day 19

On part 1, I implemented a solution that recursed over each of the 24 minutes, but it was pretty slow.  I went looking for tips and found a crucial one: "iterate over next choice of bot to build".  That made a huge difference.

Take-away: if searching through choices made at timesteps, if there is a "do nothing" choice, then instead iterate through the non-null choices and extrapolate the time steps in between.
