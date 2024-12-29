---
layout: ../../layouts/post.astro
title: Processing Images with Cloudflare Worker
description: Processing Images with Cloudflare Worker
dateFormatted: Nov 18, 2023
---

## Background

Previously, I set up a 10GB storage, unlimited bandwidth cloud storage using [Backblaze B2](https://www.backblaze.com/cloud-storage) and Cloudflare, which I use for daily file sharing and as an image hosting service for my blog. It works well with uPic. However, when using it as an image hosting service for my blog, I found that it doesn't support image resizing/cropping. I often use Alibaba Cloud OSS for image processing at work, and I couldn't stand the limitation, so I decided to create my own service.

> The free version of Workers only has a CPU limit of 10ms, and it frequently exceeds the resource usage limit, resulting in a high rate of image cracking. Now it has been adapted to Vercel Edge, which can be used with a CDN. See [https://chi.miantiao.me/post/cloudflare-worker-image/](https://chi.miantiao.me/post/cloudflare-worker-image/)

## Process

After some research, I considered two options:

1. Use Cloudflare to proxy [Vercel Image](https://vercel.com/docs/image-optimization). With this option, the traffic goes through Cloudflare -> Vercel -> Cloudflare -> Backblaze, which is not ideal in terms of stability and speed. Additionally, it only allows 1000 image processing requests per month, which is quite limited.

2. Use the public service [wsrv.nl](https://images.weserv.nl/). With this option, the traffic goes through Cloudflare -> wsrv.nl -> Cloudflare -> Backblaze, and the domain is not under my control. If I want to control the domain, I would have to go through Cloudflare Worker again, which adds complexity.

Since neither option was ideal, I kept looking for alternatives. Last week, when I was working on an Email Worker, I discovered that Cloudflare Worker supports [WebAssembly (Wasm)](https://developers.cloudflare.com/workers/runtime-apis/webassembly/), which sparked the idea of using Worker + WebAssembly to process images.

Initially, I wanted to use [sharp](https://sharp.pixelplumbing.com/), which I had used when working with Node.js. However, the author mentioned that Cloudflare Worker does not support multithreading, so sharp cannot run on Cloudflare Worker in the short term.

I searched online and found that a popular Rust library for image processing is [Photon](https://silvia-odwyer.github.io/photon/), and there is also a [demo](https://github.com/techwithdeo/cloudflare-workers/tree/main/photon-library) in the community. I tried it out and confirmed that it can run on Cloudflare Worker. However, the demo has two drawbacks:

1. Photon needs to be manually updated and cannot keep up with the official updates as quickly.
2. It can only output images in PNG format, and the file size of JPG images actually becomes larger after resizing.

## Result

Based on the keywords "Photon + Worker", I did further research and came up with a new solution inspired by [DenoFlare](https://denoflare.dev/examples/transform-images-wasm) and [jSquash](https://github.com/jamsinclair/jSquash). In the end, I used the official Photon (with patch-package as a dependency), Squash WebAssembly, and Cloudflare Worker to create an image processing service for resizing images. _I originally wanted to support output in AVIF and JPEG XL formats, but due to the 1MB size limit of the free version of Workers, I had to give up this feature_.

Supported features:

1. Supports processing of PNG, JPG, BMP, ICO, and TIFF format images.
2. Can output images in JPG, PNG, and WEBP formats, with WEBP being the default.
3. Supports pipelining, allowing multiple operations to be executed.
4. Supports Cloudflare caching.
5. Supports whitelisting of image URLs to prevent abuse.
6. Degrades gracefully in case of exceptions, returning the original image (exceptions are not cached).

## Demo

### Format Conversion

#### webp

![webp](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=webp)

#### jpg

![jpg](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=jpg)

#### png

![png](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=png)

### Resizing

![resize](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2)

### Rotation

![rotate](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=rotate!90)

### Cropping

![rotate](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=crop!0,0,1000,1000)

### Filters

![filter](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=filter%21obsidian)

### Image Watermark

![watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=watermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,20,20)

### Text Watermark

![draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=draw_text!miantiao.me,20,20)

### Pipeline Operations

#### Resize + Rotate + Text Watermark

![resize & rotate & draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Crotate!180%7Cdraw_text!miantiao.me,10,10)

#### Resize + Image Watermark

![resize & watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Cwatermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,10,10)

In theory, it supports all the operations of Photon. If you are interested, you can check the image URLs and modify the parameters according to the [Photon documentation](https://docs.rs/photon-rs/latest/photon_rs/) to try it out yourself. If you encounter any issues, feel free to leave a comment and provide feedback.

## Sharing

I have open-sourced this solution on my GitHub. If you need it, you can follow the documentation to deploy it.

[![ccbikai/cloudflare-worker-image - GitHub](https://github.html.zone/ccbikai/cloudflare-worker-image)](https://github.com/ccbikai/cloudflare-worker-image)

* * *

[![Buy Me A Coffee](https://static.miantiao.me/share/0WmsVP/CcmGr8.png)](https://www.buymeacoffee.com/ccbikai)
