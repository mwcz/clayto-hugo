#!/usr/bin/env bash

yarn upgrade
rm -rf rtw-render
mv -f node_modules/@mwcz/rtw-render ./
rm rtw-render/README.md
rm -rf node_modules
