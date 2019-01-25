#!/bin/bash

m="$(ls content/posts | grep -oP "^\d+" | sort -r | head -1)"
let "n = ${m#0} + 1"

hugo new "posts/$n - $1/index.md"

vim content/posts/$n*/index.md
