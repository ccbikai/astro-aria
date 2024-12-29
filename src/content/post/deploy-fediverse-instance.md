---
layout: ../../layouts/post.astro
title: Low-Cost Deployment of Federated Universe Personal Instances
description: Low-Cost Deployment of Federated Universe Personal Instances
dateFormatted: Nov 27, 2023
---

I came across the concept of the Fediverse at the beginning of this year and found that it is the social network I have always envisioned: each instance is like an isolated island, connected through the network to communicate with each other.

> To learn more about the Fediverse, you can read the blog posts from these individuals:
>
> - [Introduction to the Fediverse](https://zerovip.vercel.app/zh/59563/)
> - [Fediverse: The Federated Universe](https://wzyboy.im/post/1486.html)
> - [What is the Fediverse and Can It Decentralize the Internet?](https://fermi.ink/posts/2022/11/22/01/)
> - [What is Mastodon and How to Use It](https://limboy.me/posts/mastodon/)
> - [Fediverse Guide for Twitter Users](https://wzyboy.im/post/1513.html)

As a self-hosting enthusiast, I wanted to deploy my own instance. I asked about the cost of self-hosting on Mastodon and found that the minimum cost is $15/year for a server and domain name. In order to reduce costs, I didn't purchase a VPS and instead deployed my own instance on my Homelab. It has been running for half a year with a few issues (mainly due to my tinkering) such as internet or power outages at home. Since downtime results in lost messages, I decided to migrate to a server.

Among the popular software, Mastodon has more features but consumes more resources, so I chose [Pleroma](https://pleroma.social/) which consumes fewer resources but still meets my needs. I deployed it on various free services, achieving a server cost of $0 with only the domain name cost remaining. It has been running stable for a quarter.

![chi@miantiao.me](https://static.miantiao.me/share/nNbzS2/miantiao.me_chi.jpg)

Therefore, I would like to share this solution:

- Cloud platforms:
  1. [Koyeb](https://app.koyeb.com/)
  2. [Northflank](https://northflank.com/)
  3. [Zeabur](https://s.mt.ci/WrK7Dc) (Originally free, but now only available through subscription plans (free plan is for testing only))

- Database:
  1. [Aiven](https://s.mt.ci/dgQGhM)
  2. [Neon](https://neon.tech/)

- Cloud storage:
  1. [Cloudflare R2](https://www.cloudflare.com/zh-cn/developer-platform/r2/)
  2. [Backblaze B2](https://www.backblaze.com/)

- CDN:
  1. [Cloudflare](https://www.cloudflare.com/)

Deployment tutorial:

[![ccbikai/pleroma-on-cloud - GitHub](https://github.html.zone/ccbikai/pleroma-on-cloud)](https://github.com/ccbikai/pleroma-on-cloud)

Remember, free things are often the most expensive. It is important to regularly back up the database and cloud storage.

**Lastly, feel free to follow me on the Fediverse (Mastodon, Pleroma, etc.) at [@chi@miantiao.me](https://miantiao.me/@chi).**
