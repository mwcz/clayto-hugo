#!/bin/bash

m="$(ls content/posts | grep -oP "^\d+" | sort -r | head -1)"
let "n = ${m#0} + 1"

POST_PATH="posts/$(printf %03d $n) - $1/index.md"

echo creating post $POST_PATH

hugo new "$POST_PATH"

vim "content/$POST_PATH"
