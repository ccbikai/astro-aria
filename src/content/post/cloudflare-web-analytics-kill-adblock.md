---
layout: ../../layouts/post.astro
title: Solving the issue of Cloudflare Web Analytics being blocked by AdBlock
description: Solving the issue of Cloudflare Web Analytics being blocked by AdBlock
dateFormatted: Jan 8th, 2024
---

Earlier, we solved the issues of [Vercel Analytics](https://dev.to/ccbikai/jie-jue-vercel-analytics-bei-adblock-ping-bi-wen-ti-1o21-temp-slug-5601874) and [Umami](https://dev.to/ccbikai/jie-jue-umami-bei-adblock-ping-bi-wen-ti-3kc2-temp-slug-2355567) being blocked by AdBlock, and now we are also going to solve the problem for [Email.ML](https://email.ml/) which uses [Cloudflare Web Analytics](https://www.cloudflare.com/zh-cn/web-analytics/).

Cloudflare Web Analytics is blocked by the `||cloudflareinsights.com^` rule. Its script address is `https://static.cloudflareinsights.com/beacon.min.js`, and the data reporting address is `https://cloudflareinsights.com/cdn-cgi/rum`.

![||cloudflareinsights.com^](https://static.miantiao.me/share/2024/U4WHW7/GtPNhj.png)

So, just like Umami, we will proxy the script address and forward the data to the data reporting address.

## Solution

Create a Worker in Cloudflare Workers and paste the following JavaScript code. Configure the domain and test if the script address can be accessed properly. Mine is [https://cwa.miantiao.me/mt-demo.js](https://cwa.miantiao.me/mt-demo.js). The `mt-demo` can be replaced with any disguise address, the script above is already adapted.

```js
const CWA_API = 'https://cloudflareinsights.com/cdn-cgi/rum'
const CWA_SCRIPT = 'https://static.cloudflareinsights.com/beacon.min.js'

export default {
  async fetch(request, env, ctx) {
    let { pathname, search } = new URL(request.url)
    if (pathname.endsWith('.js')) {
      let response = await caches.default.match(request)
      if (!response) {
          response = await fetch(CWA_SCRIPT, request)
          ctx.waitUntil(caches.default.put(request, response.clone()))
      }
      return response
    }
    const req = new Request(request)
    req.headers.delete("cookie")
    const response = await fetch(`${CWA_API}${search}`, req)
    const headers = Object.fromEntries(response.headers.entries())
    if (!response.headers.has('Access-Control-Allow-Origin')) {
      headers['Access-Control-Allow-Origin'] = request.headers.get('Origin') || '*'
    }
    if (!response.headers.has('Access-Control-Allow-Headers')) {
      headers['Access-Control-Allow-Headers'] = 'content-type'
    }
    if (!response.headers.has('Access-Control-Allow-Credentials')) {
      headers['Access-Control-Allow-Credentials'] = 'true'
    }
    return new Response(response.body, {
      status: response.status,
      headers
    })
  },
};

```

Then inject the script into your website project, referring to my code:

```html
<script async src='https://cwa.miantiao.me/mt-demo.js' data-cf-beacon='{"send":{"to": "https://cwa.miantiao.me/mt-demo"},"token": "5403f4dc926c4e61a757d630b1ec21ad"}'></script>

```

`src` is the script address, replace `mt-demo` with any disguise address. `data-cf-beacon` contains the send to data reporting address, replace `mt-demo` with any disguise address, the script is already adapted. Remember to change the `token` to your site's token.

You can verify it on [Email.ML](https://email.ml/) or [HTML.ZONE](https://html.zone/).

**Note that using this solution requires disabling automatic configuration, otherwise the data will not be counted.**

![Disable automatic configuration](https://static.miantiao.me/share/2024/AnFeat/jqthrz.png)
