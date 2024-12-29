---
layout: ../../layouts/post.astro
title: Sink - A short link system based on Cloudflare with visit statistics
description: A short link system based on Cloudflare with visit statistics
dateFormatted: Jun 4th, 2024
---

I previously shared some websites on [Twitter](https://x.com/0xKaiBi) using short links to make it easier to see if people are interested. Among these link shortening systems, Dub provides the best user experience, but it has a fatal flaw: once the monthly clicks exceed 1000, you can no longer view the statistics.

While surfing the internet at home during the Qingming Festival, I discovered that [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) supports data writing and API data querying. So, I created an MVP version myself, capable of handling statistics for up to 3,000,000 visits per month. Cloudflare's backend likely uses Clickhouse, so performance shouldn't be a significant issue.

During the Labor Day holiday, I improved the frontend UI at home and used it for about half a month, finding it satisfactory. I have open-sourced it for everyone to use.

## Features

- Link shortening
- Visit statistics
- Serverless deployment
- Custom Slug
- 🪄 AI-generated Slug
- Link expiration

## Demo

[Sink.Cool](https://sink.cool/dashboard)

Site Token: `SinkCool`

### Site-wide Analysis

![Site-wide Analysis](https://static.miantiao.me/share/CBuVes/sink.cool_dashboard.png)

<details>
  <summary><b>Link Management</b></summary>
  <img alt="Link Management" src="https://static.miantiao.me/share/uQVX7Q/sink.cool_dashboard_links.png"/>
</details>

<details>
  <summary><b>Individual Link Analysis</b></summary>
  <img alt="Individual Link Analysis" src="https://static.miantiao.me/share/WfyCXT/sink.cool_dashboard_link_slug=0.png"/>
</details>

## Open Source

[![ccbikai/sink - GitHub](https://github.html.zone/ccbikai/sink)](https://github.com/ccbikai/sink)

## Roadmap (WIP)

- Browser extension
- Raycast extension
- Apple Shortcuts
- Enhanced link management (based on Cloudflare D1)
- Enhanced analysis (support filtering)
- Panel performance optimization (support infinite loading)
- Support for other platforms (maybe)

---

Finally, feel free to follow me on [Twitter](https://x.com/0xKaiBi) for updates on development progress and to share some web development news.
