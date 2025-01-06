---
layout: ../../layouts/post.astro
title: RSS.Beauty - Make Your RSS Beautiful!
description: Beautify your RSS feeds with RSS.Beauty, featuring elegant interfaces, responsive design, and self-hosting support. Try it now!
dateFormatted: Dec 31, 2024
---

> **The tool that has been delayed for nearly half a year is finally completed.**

[RSS.Beauty](https://rss.beauty/) is an RSS beautification tool based on XSLT technology that transforms ordinary RSS/Atom feeds into elegant reading interfaces.

![RSS.Beauty](https://rss.beauty/banner.png)

## Key Features

- 🎨 Beautiful reading interface
- 🔄 Support for RSS 2.0 and Atom 1.0
- 📱 Responsive design, mobile-friendly
- 🔌 One-click subscription to major RSS readers
- 🖥 Self-hosting support

## Quick Start

Visit [RSS.Beauty](https://rss.beauty) and enter any RSS feed URL to try it out.

Or visit <https://rss.beauty/rss?url=https%3A%2F%2Fgithub.com%2Fccbikai%2FRSS.Beauty%2Freleases.atom> to try it out.

## Tech Stack

- [Astro](https://astro.build)
- [TailwindCSS](https://tailwindcss.com)
- [XSLT](https://www.w3.org/TR/xslt/)

## Deployment

Detailed deployment guide can be found in [Deployment Guide](./docs/deployment-guide.md).

### Serverless

Support deployment to Cloudflare Pages, Vercel, Netlify, etc. After [Fork](https://github.com/ccbikai/RSS.Beauty/fork) this project, follow the platform tutorial to deploy.

### Docker

```bash
docker pull ghcr.io/ccbikai/rss.beauty:main
docker run -d --name rss-beauty -p 4321:4321 ghcr.io/ccbikai/rss.beauty:main
```

## Credits

- [Tailus UI](https://html.tailus.io/)

## Sponsor

1. [Follow me on 𝕏](https://404.li/kai)
1. [Sponsor me on GitHub](https://github.com/sponsors/ccbikai)
