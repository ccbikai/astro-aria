---
title: '该来的还是来了：迁移到Vercel'
description: '笑了，该来的还是来了。'
dateFormatted: 2021/08/20
author: Aozaki
image: https://img.aozaki.cc/20210820/0001.png
---

笑了，该来的还是来了。

先来看看我折腾多少东西：

1. Github Pages
2. Cloudflare Workers
3. Cloudflare Pages
4. Netlify
5. Vercel

正应了那句老话，正经博客内容没写几篇，结果全都是在迁移来迁移去。

当然我也不想的，只是 Netlify 实在是有点问题。我也是在昨晚迁移域名时发现的这些问题。

## Netlify 有什么问题？

Netlify 本身其实是一个不错的服务，我原先也想着要把博客和存档站分开，防止单个账户的配额因为各类意外提前用完导致两个站一起下线。

只是在昨晚迁移域名时想起来要去给百度做一下 SEO，结果发现百度压根没抓到`sitemap.xml`，而且回想起来我的`Google Analytics`确实也从来没收到过来自百度的流量。

思考了一下问题可能所在，发现平时由于习惯开着代理，可能影响网页的实际连通性检查。于是找了个在线测试，发现国内全部超时，把代理关掉也发现根本打不开站点。

好家伙，Netlify 被墙了？

检查了一下 Cloudflare 的配置没有发现与前几个月不同的地方，搜索了一下也没发现有人抱怨同一个毛病。所以得出暂时的观察结果：可能是 Netlify 的 Load Balancer IP 被橄榄了。

但是我也不太乐意用`CNAME`指向域名，加上另一个 Project 也放在了 Vercel，没用掉多少配额。加上测试下来因为 Vercel 有 aws hk 的 CDN，国内访问速度比起 netlify 优秀了不是一点点，于是一气之下全线切了 Vercel。

## 搬家到 Vercel

搬家过程就不细说了，基本和 Netlify 一样。导入 Github repo，填入`HUGO_VERSION`，等待`build`。配置域名、配置跳转。

只是由于 Vercel 的 Load balancer `CNAME`和`IP`在 5 月左右时被屏蔽，需要改用特供版才能正常解析。

另外为了防 DDoS，我在另一个 Project 上套了 Cloudflare CDN。尽管官方不建议，但是需求摆在那边：屏蔽特定地区访问、防 DDoS、防恶意爬站、防外链、速率限制等等，这些都是单纯 Vercel 或者 Netlify 做不到的。

官方其实也给出了联用的解决方法[^1]，这里提一下核心问题：

- 页面规则里把`/.well-known/*`设置为“SSL 关”
- 关闭“强制 HTTPS”

即可通过 Vercel 后台的域名可用性检查。

另外就算是用了 Cloudflare CDN，由于 Vercel 在大陆的访问速度其实还不错，建议保持缓存级别为“标准”，除非有特殊需求或目标客户认为 Cloudflare CDN 联用效果更好。

好吧，写到这里，其实下一篇博客内容也已经起了个头了…我会好好写内容的 :cry:

[^1]: How do I use a Cloudflare domain with Vercel? - [原文链接](https://vercel.com/support/articles/using-cloudflare-with-vercel#with-proxy)
