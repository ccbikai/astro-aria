---
layout: ../../layouts/post.astro
title: Cloudflare's New PyPI Mirror Service
description: Cloudflare PyPI Mirror supports PEP 691 and CORS, enabling PyPI access in mainland China for Micropip with open-source code available
dateFormatted: Dec 21, 2024
---

[Pyodide](https://micropip.pyodide.org/en/stable/index.html) is a library that runs Python in WebAssembly, using [Micropip](https://micropip.pyodide.org/en/stable/index.html) to install packages from PyPI. Due to WebAssembly's requirements for CORS and PEP 691 when running in browsers, and the fact that Tsinghua's TUNA mirror doesn't support CORS, this creates some challenges.

PyPI is not directly accessible in mainland China, but there are many mirrors available. Institutions like Tsinghua University, Alibaba Cloud, Tencent Cloud, and Huawei Cloud provide mirror services. However, except for Tsinghua's TUNA mirror, none of them support the JSON-based Simple API for Python ([PEP 691](https://peps.python.org/pep-0691/)).

Since WebAssembly requires both CORS support and PEP 691 compliance when running in browsers, and Tsinghua's TUNA mirror doesn't support CORS, there might not be any suitable PyPI mirrors available in mainland China for Micropip.

Given this situation, I've set up a Cloudflare-based mirror that supports both PEP 691 and CORS.

You can build this using either Workers or Snippets, each with their own advantages and disadvantages:

### [Workers](https://workers.cloudflare.com/)

Pros: Available with the free plan.

Cons: Generates many Worker requests, which might exceed free plan limits and require payment or become unusable.

### [Snippets](https://developers.cloudflare.com/rules/snippets/)

Pros: Doesn't generate Worker requests, supports high usage volumes. Cons: Currently only available for Pro plans and above, not available on Free tier.

## Code

The corresponding code has been open-sourced and is available at:

[https://github.com/ccbikai/cloudflare-pypi-mirror](https://github.com/ccbikai/cloudflare-pypi-mirror)

[![Cloudflare PyPI Mirror](https://github.html.zone/ccbikai/cloudflare-pypi-mirror)](https://github.com/ccbikai/cloudflare-pypi-mirror)
