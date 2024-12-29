---
layout: ../../layouts/post.astro
title: Extract GitHub OpenGraph Images for Card Previews
description: Extract GitHub OpenGraph Images for Card Previews
dateFormatted: Dec 19, 2023
---

Previously, when sharing GitHub on my blog, I always used [GitHub Repository Card](https://gh-card.dev/) for sharing, but it doesn't have good support for Chinese and doesn't support line breaks.

[![ccbikai/cloudflare-worker-image - GitHub](https://gh-card.dev/repos/ccbikai/cloudflare-worker-image.svg?fullname=)](https://github.com/ccbikai/cloudflare-worker-image)

Originally, I planned to create my own using [@vercel/og](https://vercel.com/docs/functions/edge-functions/og-image-generation), but I accidentally discovered that GitHub provides comprehensive and beautiful Open Graph images on Twitter. So, I wrote a script to extract and use them for blog previews.

## Demo

![nasa/fprime - GitHub](https://github.html.zone/nasa/fprime)

![A framework for building Open Graph images](https://static.miantiao.me/share/9ZxTs8/RZHfnD.png)

In addition to repositories, GitHub's Open Graph also supports previews for Issue, Pull Request, Discussion, and Commit modules.

## Usage

**Modify `.com` to `.html.zone` on any GitHub page**.

For example, [https://github.com/vercel/next.js](https://github.com/vercel/next.js) => [https://github.html.zone/vercel/next.js](https://github.html.zone/vercel/next.js).

### Previews

#### Repo

![Repo](https://github.html.zone/vercel/next.js)

#### Issue

![Issue](https://github.html.zone/vuejs/core/issues/9862)

#### Pull Request

![Pull Request](https://github.html.zone/lobehub/lobe-chat/pull/529)

#### Discussion

![Discussion](https://github.html.zone/lobehub/lobe-chat/discussions/551)

#### Commit

![Commit](https://github.html.zone/vercel/next.js/commit/a65fb162989fd00ca21534947538b8dbb6bf7f86)

## Source Code

The code has been shared on GitHub for those interested to explore.

[![ccbikai/github-og-image - GitHub](https://github.html.zone/ccbikai/github-og-image)](https://github.com/ccbikai/github-og-image)
