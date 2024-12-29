---
layout: ../../layouts/post.astro
title: Browser locally uses AI to remove image backgrounds
description: Browser locally uses AI to remove image backgrounds
dateFormatted: Jul 14, 2024
---

Yo, so I've been digging into this whole AI thing for front-end development lately, and stumbled upon this cool Transformers.js example.  Turned it into a sweet little tool, check it out!

Basically, it uses Transformers.js in a WebWorker to tap into WebGPU and run this RMBG-1.4 model.  Long story short, you can now use AI to nuke image backgrounds right in your browser. And get this, it only takes half a second to process a 4K image on my M1 PRO!

Here's the link to the tool: [https://html.zone/background-remover](https://html.zone/background-remover)

[![AI background remover](https://og-image.html.zone/https://html.zone/background-remover)](https://html.zone/background-remover)

* * *

Wanna build it yourself?  Head over to [https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client) for the source code.  Oh, and heads up, you gotta be on Transformers.js V3 to mess with WebGPU.
