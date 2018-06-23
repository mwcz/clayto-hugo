---
Title: "Opcode patterns 70% finished"
Date: 2011-10-13
Tags:
 -  aejs
 -  html5
 -  javascript
 -  amiga
 -  web
Mwc: 14
---

genlut.py is really filling out.  It generates the LUT for all 68k opcodes (68000 only), and I'm about 70% done.  77 down, 34 to go.

The OPCODES dict defines the first two bytes of each opcode, both static bits and operands.  The operand strings act as keys into the PATTERNS struct, which contains all possible values for each operand.

The recursive function gen() is fed an opcode pattern which may contain operand strings as well as static bits.  Some operand patterns contain other operand patterns, so gen() keeps recursing until all operand patterns are gone.  Once a set of totally static bits has been created, those bits are added to INSTRUCTIONS, along with the name of the opcode.

The PATTERNS, OPCODES, and INSTRUCTIONS dicts are all named poorly, and the whole solution  isn't ultra-elegant, but it does follow the structure of the 68k PRM pretty intuitively and is easy to edit.  Once it's complete, I should never need to run it again.

(This post was copied from my old [AEJS blog](http://aejs.blogspot.com/))
