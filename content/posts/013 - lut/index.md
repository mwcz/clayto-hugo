---
Title: "LUT"
Date: 2011-09-22
Tags:
 -  aejs
 -  html5
 -  javascript
 -  amiga
 -  web
Mwc: 13
---

Decoding is easy. Decoding requires a lot of typing. (I am starting to believe this is true of ever aspect of interpreted emulation...)


For the AEJS decoder, I am creating a [look-up table](http://en.wikipedia.org/wiki/Lookup_table) with every possible pattern for each instruction. It was my first idea, but I initially discarded it as "wasteful and inelegant". Later, I accepted it as "really fast".


I'm generating a large set of bit patterns that map to 68k opcodes, like so:

    0100101011111010 -> BGND
    0100101011111100 -> ILLEGAL
    0100111001110000 -> RESET
    0100111001110001 -> NOP
    0100111001110010 -> STOP
    0100111001110011 -> RTE

The current code can be found [here](https://github.com/mwcz/AEJS/blob/master/src/genlut.py).


Yes, it's written in Python and yes, AEJS is a JavaScript project.  There's a reason.  I see two approaches to generating the LUT (look-up table).


Generate the LUT on launch (dynamic)
------------------------------------


This has the advantage of being easier to debug.  It also might be easier if I ever expand the emulator to other chips, like the [68020](http://en.wikipedia.org/wiki/Motorola_68020) or [68030](http://en.wikipedia.org/wiki/Motorola_68030).


It currently takes about 0.466 seconds on my machine to generate ~12,000 patterns.  That means it should take less than 2.5s to generate the full LUT.



Generate the LUT pre-launch (static)
------------------------------------

This is what I'm currently working toward.  genlut.py is currently generating about 12,000 opcode bit patterns out of a max of I'm-not-sure-yet-but-slightly-less-than-65,536.

With this method, I would run genlut.py one final time, pipe the output into a static JS file, and regex the contents into a JS array.  The LUT would never have to be generated again, and would exist happily forever-after.

Cons: relies upon the LUT being 100% correct, as any errors would be hard to debug, and would require another run of genlut.py to fix.

Pros: AEJS will launch faster without having to generate the LUT each time.  If I can verify that the LUT is 100% correct, this is obviously the right approach.

I'll continue on with the static method for now, and odds are I'll stick with it.   2.5s is too big a price to pay.


Back to work:

[<img class="grid_7" src="workarea.png" alt=":)" title="" />](workarea.png)
<div class="clear"></div>

(This post was copied from my old [AEJS blog](http://aejs.blogspot.com/))
