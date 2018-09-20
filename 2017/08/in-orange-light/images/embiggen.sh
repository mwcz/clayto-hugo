#!/bin/bash

for sprite in $1; do
    convert -scale 400% $sprite big/$sprite
    echo "embiggened $sprite"
done
