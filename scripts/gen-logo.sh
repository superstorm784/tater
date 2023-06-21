#!/bin/bash

magick "logo.svg" -background transparent "logo512.png"
magick "logo.svg" -transparent white -resize 64x64 -density 64x64 "favicon.ico"
magick "logo.svg" -background transparent -resize 192x192 -density 192x192 "logo192.png"