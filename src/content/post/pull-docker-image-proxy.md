---
title: '通过代理拉取 Docker Hub 镜像'
dateFormatted: 2024/06/11
description: '您就倒车油门焊死吧。'
author: Aozaki
---

## 噩耗

突闻 SJTU 以及 NJU 的 Docker Hub 镜像突然被停，怒骂利维坦的同时也不得不为自己的群晖寻找出路。之前全靠 SJTU 镜像拉取，又嫌群晖魔改太多改设置麻烦，就没深究过，这下不得不动手了。

## 群晖（DSM 7.0+）设置代理

这个其实有一点点 Tricky，因为群晖的魔改实在太多，Docker 成了 Container Manager 导致服务名需要修改一下。

首先切换为 `root`

```bash
sudo -i
```

然后创建相关文件夹及文件

```bash
mkdir -p /etc/systemd/system/pkg-ContainerManager-dockerd.service.d
cd /etc/systemd/system/pkg-ContainerManager-dockerd.service.d
vim http-proxy.conf
```

更改代理地址后复制粘贴如下内容，代理地址记得替换成自己的

```conf
[Service]
Environment="HTTP_PROXY=http://192.168.1.3:1088"
Environment="HTTPS_PROXY=http://192.168.1.3:1088"
Environment="NO_PROXY=localhost,127.0.0.1"
```

随后重启相关服务

```bash
systemctl daemon-reload
systemctl restart pkg-ContainerManager-dockerd.service
```

验证已起效

```bash
systemctl show --property=Environment pkg-ContainerManager-dockerd.service
```

## Linux 上设置代理

大同小异，`dockerd` 的 `systemd` 为 `/etc/systemd/system/docker.service.d`

首先切换为 `root`

```bash
sudo -i
```

然后创建相关文件夹及文件

```bash
mkdir -p /etc/systemd/system/docker.service.d
cd /etc/systemd/system/docker.service.d
vim http-proxy.conf
```

更改代理地址后复制粘贴如下内容，代理地址记得替换成自己的

```conf
[Service]
Environment="HTTP_PROXY=http://192.168.1.3:1088"
Environment="HTTPS_PROXY=http://192.168.1.3:1088"
Environment="NO_PROXY=localhost,127.0.0.1"
```

随后重启相关服务

```bash
systemctl daemon-reload
systemctl restart docker
```

验证已起效

```bash
sudo systemctl show --property=Environment docker
```

## 吐槽

Docker 官方的教程极具迷惑性，例如 [这篇文章](https://docs.docker.com/network/proxy/#configure-the-docker-client) 提到的，实际上是给容器设置代理，而不是设置通过代理拉取镜像。也得亏是镜像纷纷失效才终于让各位网友说出正确答案…

另外也有网友提到说可以给群晖设置全局代理，但现实是群晖上通常还跑着各种 BT PT 下载服务，过代理万一分流漏了，只会给自己带来无穷无尽的麻烦，所以不推荐。

总之目前还能通过代理拉取镜像，不知道安稳日子能过几天呢？

---

### 参考文章

1. [怎样才能让我的 docker 走代理 #33](https://www.v2ex.com/t/874777#r_14697469)
2. [如何配置docker通过代理服务器拉取镜像](https://www.lfhacks.com/tech/pull-docker-images-behind-proxy/)
