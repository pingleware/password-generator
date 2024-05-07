#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first."
    exit 1
fi

# Check if at least one argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <text>"
    exit 1
fi

# Assign input text to a variable
text="$1"

# Determine font size based on text length
text_length=${#text}
if [ $text_length -lt 10 ]; then
    font_size=48
elif [ $text_length -lt 22 ]; then
    font_size=22
else
    font_size=14
fi

# Create PNG image
convert -size 512x512 xc:white -font Arial -pointsize $font_size -fill black -gravity center -annotate +0+0 "$text" assets/logo.png

# Create ICNS image
#convert -size 512x512 xc:white -font Arial -pointsize 96 -fill black -gravity center -annotate +0+0 "$text" -define icns:subtype=imac -define icns:shell_version=512 assets/logo.icns

echo "Image created: assets/logo.png"
