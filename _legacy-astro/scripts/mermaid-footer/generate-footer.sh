#!/bin/bash

# Generate the footer image using Chromium in headless mode
chromium --headless --disable-gpu --screenshot=ciprian-rarau-new.png \
  --window-size=1760,136 \
  --default-background-color=0 \
  file:///Users/ciprianrarau/123/ciprianrarau.com/scripts/mermaid-footer/create-footer.html

echo "Footer generated as ciprian-rarau-new.png"