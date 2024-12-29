---
layout: ../../layouts/post.astro
title: Solving Vercel Analytics Blocked by AdBlock Issue
description: Solving Vercel Analytics Blocked by AdBlock Issue
dateFormatted: Jun 6, 2024
---

[DNS.Surf](https://dns.surf/) runs 100% on Vercel, so Vercel Analytics is used for access statistics. However, many users who have AdBlock installed experience issues with access statistics not being recorded. Today, we will solve the problem of AdBlock blocking access statistics, while still relying on Vercel 100%.

The core principle of AdBlock is to block certain network requests and page elements using rules. Vercel Analytics is blocked by the rule `/_vercel/insights/script.js`, and it may also block `/_vercel/insights/event`. To solve this problem, we just need to make these two URLs less recognizable.

![/_vercel/insights/script.js](https://static.miantiao.me/share/2024/JbSVLo/5aOZdV.png)

## Solution

Vercel comes with a Rewrite feature, so we just need to rewrite the disguised path `/mt-demo` to `/_vercel/insights`. The disguised path can be any unique path that does not conflict with existing paths. If it gets blocked, just use a different one. The vercel.json configuration is as follows:

```js
{
  "rewrites": [
    {
      "source": "/mt-demo/:match*",
      "destination": "https://dns.surf/_vercel/insights/:match*"
    }
  ]
}
```

Note that the destination should be the complete URL, otherwise it will not work.

In the official tutorial, different frameworks use [@vercel/analytics](https://vercel.com/docs/analytics/package) to inject the analytics script into the page, but it does not support custom scripts and data reporting URLs. Therefore, we need to use the HTML method to inject the script.

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script async src="/mt-demo/script.js" data-endpoint="/mt-demo"></script>
```

`src` is the script URL, and `data-endpoint` is the data reporting URL. Although it is not mentioned in the official documentation, the script does support it. Remember to replace `mt-demo` with your disguised path.

If you are using a different framework, you can look for the method to inject scripts in that framework to adapt it to your own usage.

You can verify the effect using [DNS.Surf](https://dns.surf/).
