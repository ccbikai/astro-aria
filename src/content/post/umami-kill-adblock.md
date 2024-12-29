---
layout: ../../layouts/post.astro
title: Resolving Umami Blocked by AdBlock Issue
description: Resolving Umami Blocked by AdBlock Issue
dateFormatted: Jan 6, 2024
---

I recently redesigned my [personal homepage](https://mt.ci/) and used Umami for website analytics. However, there is an ongoing issue: users who have AdBlock installed are causing the analytics to fail.

For more information on how AdBlock works, you can refer to [Resolving Vercel Analytics Blocked by AdBlock Issue](11). The rule that blocks Umami is `||umami.is^$3p`, which blocks the script and data reporting URLs. To overcome this, we can use [Cloudflare Workers](https://workers.cloudflare.com/) to proxy Umami.

![||umami.is^$3p](https://static.miantiao.me/share/2024/CNrM78/ha30pV.png)

## Solution

Create a Cloudflare Worker and paste the following JavaScript code. If you are using the official Umami service, you don't need to modify the code (remember to change UMAMI\_HOST to your service URL). If you are using a self-hosted service, you can define the script and data reporting URLs using the `TRACKER_SCRIPT_NAME` and `COLLECT_API_ENDPOINT` environment variables, without the need for proxying.

```js
const UMAMI_HOST = 'https://eu.umami.is'

export default {
  async fetch(request, env, ctx) {
    const { pathname, search } = new URL(request.url)
    if (pathname.endsWith('.js')) {
      let response = await caches.default.match(request)
      if (!response) {
          response = await fetch(`${UMAMI_HOST}/script.js`, request)
          ctx.waitUntil(caches.default.put(request, response.clone()))
      }
      return response
    }
    const req = new Request(request)
    req.headers.delete("cookie")
    req.headers.append('x-client-ip', req.headers.get('cf-connecting-ip'))
    return fetch(`${UMAMI_HOST}${pathname}${search}`, req)
  },
};

```

Once you have created the Worker, configure the domain and test if the script URL can be accessed correctly. In my case, it is [https://ums.miantiao.me/mt-demo.js](https://ums.miantiao.me/mt-demo.js). You can replace "mt-demo" with any disguised URL, as the script has already been adapted.

Next, inject the script into your website project. You can refer to the official documentation at [https://umami.is/docs/tracker-configuration](https://umami.is/docs/tracker-configuration) or use the following code as a reference:

```html
<script defer src="https://ums.miantiao.me/mt-demo.js" data-host-url="https://ums.miantiao.me" data-website-id="0a10de75-03be-4fec-a521-4c62b91650ac"></script>

```

In the above code, `src` refers to the script URL, `data-host-url` refers to the data reporting URL, and `data-website-id` refers to the website ID. Make sure to provide the correct website ID to ensure data reporting.

You can verify the implementation on [Noodle Lab](https://mt.ci/) or this website.
