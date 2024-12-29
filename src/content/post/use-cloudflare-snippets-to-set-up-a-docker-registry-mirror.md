---
layout: ../../layouts/post.astro
title: Docker Registry Mirror via Cloudflare
description: Set up a Docker Registry Mirror using Cloudflare Snippets with low-cost proxy solutions and modified code for various container registries
dateFormatted: Dec 21, 2024
---

Using Cloudflare Workers to set up Docker image proxies works fine for personal use with low request volumes. However, if made public, high request volumes can incur significant costs.

Actually, Cloudflare has an even lighter JS Runtime called Cloudflare Snippets, though it comes with stricter limitations: 5ms CPU execution time, 2MB memory limit, and 32KB code size limit. Still, it's sufficient for request rewriting purposes.

Unfortunately, Cloudflare Snippets isn't currently available for Free plans, although [their blog mentions that Free plans can create 5 Snippets](https://blog.cloudflare.com/zh-cn/snippets-announcement/).

If you have a Pro plan, you can slightly modify the Cloudflare Workers code to run it. It supports Docker Hub, Google Container Registry, GitHub Container Registry, Amazon Elastic Container Registry, Kubernetes Container Registry, Quay, and Cloudsmith.

Modified code:

```javascript
// Raw Codes: https://github.com/ciiiii/cloudflare-docker-proxy/blob/master/src/index.js

const CUSTOM_DOMAIN = 'your.domains'
const MODE = 'production'

const dockerHub = 'https://registry-1.docker.io'

const routes = {
    // production
    [`docker.${CUSTOM_DOMAIN}`]: dockerHub,
    [`quay.${CUSTOM_DOMAIN}`]: 'https://quay.io',
    [`gcr.${CUSTOM_DOMAIN}`]: 'https://gcr.io',
    [`k8s-gcr.${CUSTOM_DOMAIN}`]: 'https://k8s.gcr.io',
    [`k8s.${CUSTOM_DOMAIN}`]: 'https://registry.k8s.io',
    [`ghcr.${CUSTOM_DOMAIN}`]: 'https://ghcr.io',
    [`cloudsmith.${CUSTOM_DOMAIN}`]: 'https://docker.cloudsmith.io',
    [`ecr.${CUSTOM_DOMAIN}`]: 'https://public.ecr.aws',

    // staging
    [`docker-staging.${CUSTOM_DOMAIN}`]: dockerHub,
}

async function handleRequest(request) {
    const url = new URL(request.url)
    const upstream = routeByHosts(url.hostname)
    if (upstream === '') {
        return new Response(
            JSON.stringify({
                routes,
            }), {
                status: 404,
            },
        )
    }
    const isDockerHub = upstream === dockerHub
    const authorization = request.headers.get('Authorization')
    if (url.pathname === '/v2/') {
        const newUrl = new URL(`${upstream}/v2/`)
        const headers = new Headers()
        if (authorization) {
            headers.set('Authorization', authorization)
        }
        // check if need to authenticate
        const resp = await fetch(newUrl.toString(), {
            method: 'GET',
            headers,
            redirect: 'follow',
        })
        if (resp.status === 401) {
            return responseUnauthorized(url)
        }
        return resp
    }
    // get token
    if (url.pathname === '/v2/auth') {
        const newUrl = new URL(`${upstream}/v2/`)
        const resp = await fetch(newUrl.toString(), {
            method: 'GET',
            redirect: 'follow',
        })
        if (resp.status !== 401) {
            return resp
        }
        const authenticateStr = resp.headers.get('WWW-Authenticate')
        if (authenticateStr === null) {
            return resp
        }
        const wwwAuthenticate = parseAuthenticate(authenticateStr)
        let scope = url.searchParams.get('scope')
        // autocomplete repo part into scope for DockerHub library images
        // Example: repository:busybox:pull => repository:library/busybox:pull
        if (scope && isDockerHub) {
            const scopeParts = scope.split(':')
            if (scopeParts.length === 3 && !scopeParts[1].includes('/')) {
                scopeParts[1] = `library/${scopeParts[1]}`
                scope = scopeParts.join(':')
            }
        }
        return await fetchToken(wwwAuthenticate, scope, authorization)
    }
    // redirect for DockerHub library images
    // Example: /v2/busybox/manifests/latest => /v2/library/busybox/manifests/latest
    if (isDockerHub) {
        const pathParts = url.pathname.split('/')
        if (pathParts.length === 5) {
            pathParts.splice(2, 0, 'library')
            const redirectUrl = new URL(url)
            redirectUrl.pathname = pathParts.join('/')
            return Response.redirect(redirectUrl, 301)
        }
    }
    // foward requests
    const newUrl = new URL(upstream + url.pathname)
    const newReq = new Request(newUrl, {
        method: request.method,
        headers: request.headers,
        redirect: 'follow',
    })
    const resp = await fetch(newReq)
    if (resp.status === 401) {
        return responseUnauthorized(url)
    }
    return resp
}

function routeByHosts(host) {
    if (host in routes) {
        return routes[host]
    }
    if (MODE === 'debug') {
        return dockerHub
    }
    return ''
}

function parseAuthenticate(authenticateStr) {
    // sample: Bearer realm="https://auth.ipv6.docker.com/token",service="registry.docker.io"
    // match strings after =" and before "
    const re = /(?<==")(?:\\.|[^"\\])*(?=")/g
    const matches = authenticateStr.match(re)
    if (matches == null || matches.length < 2) {
        throw new Error(`invalid Www-Authenticate Header: ${authenticateStr}`)
    }
    return {
        realm: matches[0],
        service: matches[1],
    }
}

async function fetchToken(wwwAuthenticate, scope, authorization) {
    const url = new URL(wwwAuthenticate.realm)
    if (wwwAuthenticate.service.length) {
        url.searchParams.set('service', wwwAuthenticate.service)
    }
    if (scope) {
        url.searchParams.set('scope', scope)
    }
    const headers = new Headers()
    if (authorization) {
        headers.set('Authorization', authorization)
    }
    return await fetch(url, {
        method: 'GET',
        headers
    })
}

function responseUnauthorized(url) {
    const headers = new(Headers)()
    if (MODE === 'debug') {
        headers.set(
            'Www-Authenticate',
            `Bearer realm="http://${url.host}/v2/auth",service="cloudflare-docker-proxy"`,
        )
    } else {
        headers.set(
            'Www-Authenticate',
            `Bearer realm="https://${url.hostname}/v2/auth",service="cloudflare-docker-proxy"`,
        )
    }
    return new Response(JSON.stringify({
        message: 'UNAUTHORIZED'
    }), {
        status: 401,
        headers,
    })
}

export default {
    fetch: handleRequest,
}
```
