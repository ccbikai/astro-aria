---
layout: ../../layouts/post.astro
title: Using Vercel Edge to Process Images
description: Using Vercel Edge to Process Images
dateFormatted: Dec 17th, 2023
---

Previously, I shared an article on [using Cloudflare Worker to process images](https://dev.to/ccbikai/shi-yong-cloudflare-worker-chu-li-tu-pian-38dl-temp-slug-7437591). However, due to the limitations of the free version of Worker, which only allows for 10ms of CPU usage, there were frequent resource overages and high failure rates. Today, I had some free time, so I decided to try using Vercel Edge instead and share my findings with those who are interested.

The official version of Vercel also supports image processing, but it has a limit of 1000 original images per month and only supports scaling. By using Vercel Edge to process images, you can have additional features such as scaling, cropping, watermarking, and filters. However, please note that the free version of Vercel only allows for 100GB of monthly traffic, so it is recommended to use it in conjunction with a CDN for actual usage.

Supported features:

1. Support for processing PNG, JPG, BMP, ICO, and TIFF format images
2. Output images in JPG, PNG, and WEBP formats, with WEBP being the default
3. Support for pipelining, allowing for multiple operations to be performed
4. Support for whitelisting image URLs to prevent abuse
5. Graceful degradation in case of processing failure, returning the original image (exceptions are not cached)

## Demo

### Format Conversion

#### WEBP

![webp](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=webp)

#### JPG

![jpg](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=jpg)

#### PNG

![png](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=png)

### Scaling

![resize](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2)

### Rotation

![rotate](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=rotate!90)

### Cropping

![rotate](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=crop!0,0,1000,1000)

### Filters

![filter](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=filter%21obsidian)

### Image Watermark

![watermark](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=watermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,20,20)

### Text Watermark

![draw_text](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=draw_text!miantiao.me,20,20)

### Pipelining

#### Scaling + Rotation + Text Watermark

![resize & rotate & draw_text](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Crotate!180%7Cdraw_text!miantiao.me,10,10)

#### Scaling + Image Watermark

![resize & watermark](https://edge-image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Cwatermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,10,10)

In theory, it supports various operations available in Photon. If you are interested, you can check the image URLs and modify the parameters according to the [Photon documentation](https://docs.rs/photon-rs/latest/photon_rs/) to try it out yourself. If you encounter any issues, please leave a comment and provide feedback.

## Sharing

I have open-sourced this solution on my GitHub repository, and you can deploy it by following the documentation.

[![ccbikai/vercel-edge-image - GitHub](https://github.html.zone/ccbikai/vercel-edge-image)](https://github.com/ccbikai/vercel-edge-image)

* * *

[![Buy Me A Coffee](https://static.miantiao.me/share/0WmsVP/CcmGr8.png)](https://www.buymeacoffee.com/ccbikai)
