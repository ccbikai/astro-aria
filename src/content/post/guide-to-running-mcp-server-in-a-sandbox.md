---
layout: ../../layouts/post.astro
title: Run MCP Server in a Docker sandbox
description: Run MCP Server in a Docker sandbox to avoid supply chain attacks.
dateFormatted: Apr 25, 2025
---

MCP is a hot protocol in the AI development industry this year, but its Client/Server (C/S) architecture requires users to run the MCP Server locally.

Common ways to run MCP Server include stdio methods like npx (NPM ecosystem), uvx (Python ecosystem), Docker, and HTTP (SSE/Streaming) methods. However, running commands with npx and uvx carries significant risks. Accidentally executing a malicious package could lead to sensitive data exposure, posing a major security threat. For details, you can refer to Invariant's article [MCP Security Notification: Tool Poisoning Attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks).

As a software industry professional, I have a high degree of concern for security. I asked ChatGPT to compile a list of NPM and PyPI supply chain attack incidents from the past 5 years, and it was chilling.

| **Time** | **Event** | **Summary and Scope of Impact** |
| --- | --- | --- |
| **February 2021** | **"Dependency Confusion" Vulnerability Disclosure** | Security researcher Alex Birsan utilized the **Dependency Confusion** technique to upload packages to NPM/PyPI with the same names as internal libraries used by multiple companies, successfully infiltrating the internal servers of 35 major companies including Apple and Microsoft ([PyPI flooded with 1,275 dependency confusion packages](https://www.sonatype.com/blog/pypi-flooded-with-over-1200-dependency-confusion-packages#:~:text=Dependency%20confusion%3A%20Year%20in%20review)). This demonstration sparked high concern within the industry regarding supply chain risks. |
| **October 2021** | **UAParser.js Library Hijacked** | The popular library _ua-parser-js_ on NPM, with over 7 million weekly downloads, was compromised by attackers via the maintainer's account to publish malicious versions ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=%23%23%20%20Popular%20%22ua,Attacked)). Infected versions implanted **password-stealing trojans** and **cryptocurrency miners** upon installation, affecting a large number of developer systems. |
| **October 2021** | **Poisoning via Fake Roblox Libraries** | Attackers uploaded multiple packages impersonating Roblox API on NPM (e.g., _noblox.js-proxy_), containing obfuscated malicious code. These packages would implant **trojans and ransomware** payloads after installation ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=,and%20has%20a%20Spooky%20Surprise)). These packages were downloaded thousands of times, demonstrating attackers used **typosquatting** to trick game developers. |
| **November 2021** | **COA and RC Libraries Successively Hijacked** | Popular libraries on NPM, _coa_ (millions of weekly downloads) and _rc_ (14 million weekly downloads), were successively compromised to publish malicious versions. The affected versions executed **credential-stealing trojans** similar to the UAParser.js case, at one point causing build pipelines to break for numerous projects globally using frameworks like React ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=,js)) ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=,Is%20Hijacked%2C%20Too)). Official investigations determined the cause in both cases was compromised maintainer accounts. |
| **January 2022** | **Colors/Faker Open Source Libraries "Suicide"** | The authors of the famous color formatting library _colors.js_ and test data generation library _faker.js_, out of protest, injected destructive code like infinite loops in the latest versions, causing thousands of projects, including those at companies like Meta (Facebook) and Amazon, to crash ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=Thousands%20of%20open%20source%20projects,companies%20exploiting%20open%20source)) (While not an external attack, it falls within the scope of supply chain poisoning). |
| **January 2022** | **PyPI: 1,275 Malicious Packages Deployed in Bulk** | A single user frantically published **1,275 malicious packages** to PyPI in one day on January 23rd ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=,Than%201%2C200%20Dependency%20Confusion%20Packages)). Most of these packages impersonated the names of well-known projects or companies (e.g., _xcryptography_, _Sagepay_, etc.). After installation, they collected fingerprint information like hostname, IP, etc., and exfiltrated it to the attackers via DNS/HTTP ([PyPI flooded with 1,275 dependency confusion packages](https://www.sonatype.com/blog/pypi-flooded-with-over-1200-dependency-confusion-packages#:~:text=The%20,of%20these%20components%20are%20installed)) ([PyPI flooded with 1,275 dependency confusion packages](https://www.sonatype.com/blog/pypi-flooded-with-over-1200-dependency-confusion-packages#:~:text=For%20DNS%3A%20.sub.deliverycontent,online)). PyPI administrators took down all related packages within an hour of receiving the report ([PyPI flooded with 1,275 dependency confusion packages](https://www.sonatype.com/blog/pypi-flooded-with-over-1200-dependency-confusion-packages#:~:text=All%20of%20the%201%2C275%20were,an%20hour%20of%20our%20report)). |
| **March 2022** | **Node-ipc "Protestware" Incident** | The author of _node-ipc_, a commonly used front-end build library, added malicious code in versions v10.1.1–10.1.3: when detecting client IPs belonging to Russia or Belarus, it would **wipe the file system** and overwrite files with heart emojis ([Corrupted open-source software enters the Russian battlefield | ZDNET](https://www.zdnet.com/article/corrupted-open-source-software-enters-the-russian-battlefield/#:~:text=To%20be%20exact%2C%20Miller%20added,annoying%20to%20a%20system%20destroyer)) ([Corrupted open-source software enters the Russian battlefield | ZDNET](https://www.zdnet.com/article/corrupted-open-source-software-enters%20the%20russian%20battlefield/#:~:text=According%20to%20developer%20security%20company,8%2C%20critical)). This library was widely depended upon by Vue CLI, etc., causing widespread damage to user systems and was assigned CVE-2022-23812 (CVSS 9.8) ([Corrupted open-source software enters the Russian battlefield | ZDNET](https://www.zdnet.com/article/corrupted-open-source-software-enters-the-russian-battlefield/#:~:text=According%20to%20developer%20security%20company,8%2C%20critical)). |
| **October 2022** | **LofyGang Large-Scale Poisoning Campaign** | Security companies discovered a group named "LofyGang" distributed nearly **200 malicious packages** on NPM ([LofyGang Distributed ~200 Malicious NPM Packages to Steal Credit Card Data](https://thehackernews.com/2022/10/lofygang-distributed-200-malicious-npm.html#:~:text=Multiple%20campaigns%20that%20distributed%20trojanized,single%20threat%20actor%20dubbed%20LofyGang)). These packages implanted **trojans** through **typosquatting** and by impersonating common library names, stealing developers' credit card information, Discord accounts, and game service login credentials, accumulating thousands of installations ([LofyGang Distributed ~200 Malicious NPM Packages to Steal Credit Card Data](https://thehackernews.com/2022/10/lofygang-distributed-200-malicious-npm.html#:~:text=Multiple%20campaigns%20that%20distributed%20trojanized,single%20threat%20actor%20dubbed%20LofyGang)). This was an organized cybercrime activity that lasted over a year. |
| **December 2022** | **PyTorch-nightly Dependency Chain Attack** | Well-known deep learning framework PyTorch disclosed that its nightly version suffered a **dependency confusion** supply chain attack between December 25-30 ([Malicious PyTorch dependency ‘torchtriton’ on PyPI | Wiz Blog](https://www.wiz.io/blog/malicious-pytorch-dependency-torchtriton-on-pypi-everything-you-need-to-know#:~:text=means%20that%20anyone%20who%20downloaded,and%20rotate%20any%20discovered%20keys)). Attackers registered a malicious package named _torchtriton_ on PyPI, sharing the same name as a private dependency required by the PyTorch nightly version, resulting in thousands of users who installed the nightly version via pip being affected ([Malicious PyTorch dependency ‘torchtriton’ on PyPI | Wiz Blog](https://www.wiz.io/blog/malicious-pytorch-dependency-torchtriton-on-pypi-everything%20you%20need%20to%20know#:~:text=means%20that%20anyone%20who%20downloaded,and%20rotate%20any%20discovered%20keys)). The malicious _torchtriton_ package, when run, collected system environment variables and secrets and uploaded them to the attacker's server, jeopardizing users' cloud credential security. PyTorch officially issued an urgent warning and replaced the namespace ([Malicious PyTorch dependency ‘torchtriton’ on PyPI | Wiz Blog](https://www.wiz.io/blog/malicious-pytorch-dependency-torchtriton-on-pypi-everything%20you%20need%20to%20know#:~:text=The%20creator%20of%20the%20copied,were%20stored%20on%20impacted%20resources)). |
| **March 2023** | **"W4SP Stealer" Trojan Rampant on PyPI** | Security researchers successively discovered a large number of malicious packages carrying the **W4SP Stealer** information-stealing trojan appearing on PyPI ([W4SP Stealer Discovered in Multiple PyPI Packages Under Various Names](https://thehackernews.com/2022/12/w4sp-stealer-discovered-in-multiple.html#:~:text=Threat%20actors%20have%20published%20yet,malware%20on%20compromised%20developer%20machines)). These trojans have many aliases (e.g., ANGEL Stealer, PURE Stealer, etc.) but essentially all belong to the W4SP family, specifically designed to steal information like user passwords, cryptocurrency wallets, and Discord tokens ([W4SP Stealer Discovered in Multiple PyPI Packages Under Various Names](https://thehackernews.com/2022/12/w4sp-stealer-discovered-in%20multiple.html#:~:text=Interestingly%2C%20while%20the%20malware%20goes,be%20copies%20of%20W4SP%20Stealer)). A single report revealed 16 such malicious packages (e.g., _modulesecurity_, _easycordey_, etc.) ([W4SP Stealer Discovered in Multiple PyPI Packages Under Various Names](https://thehackernews.com/2022/12/w4sp-stealer-discovered-in-multiple.html#:~:text=The%2016%20rogue%20modules%20are,nowsys%2C%20upamonkws%2C%20captchaboy%2C%20and%20proxybooster)). PyPI initiated a cleanup targeting such trojans and strengthened upload detection. |
| **August 2023** | **Lazarus Group Attacks PyPI** | ReversingLabs reported that a branch of the North Korean hacking group Lazarus published over two dozen (more than 24) malicious packages disguised as popular libraries on PyPI (codenamed "VMConnect" operation) ([Software Supply Chain Attacks: A (partial) History](https://www.reversinglabs.com/blog/a-partial-history-of-software-supply-chain-attacks#:~:text=)). These packages attempted to target users in specific industries (e.g., finance) to implant remote access trojans. It is claimed this attack is linked to previous similar activities targeting NuGet, showing state-sponsored hackers' interest in the open-source supply chain. |
| **2024 and Beyond** | **Ongoing Supply Chain Threats** | Since 2024, new poisoning incidents continue to emerge on NPM and PyPI. For example, in early 2024, fake VS Code-related NPM packages were found to contain remote control spyware ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=,altered%20ScreenConnect%20utility%20as%20spyware)), and PyPI packages impersonating Solana libraries to steal crypto wallet keys ([A Timeline of SSC Attacks, Curated by Sonatype](https://www.sonatype.com/resources/vulnerability-timeline#:~:text=%23%23%20%20Ideal%20typosquat%20%27solana,steals%20your%20crypto%20wallet%20keys)) were discovered. This indicates that supply chain attacks have become a normalized threat, requiring the ecosystem to continuously raise vigilance and defense capabilities. |

I complained a bit on Twitter, and while complaining, I saw a tweet from a friend who had just encountered a supply chain attack incident.

[![Twitter](https://static.miantiao.me/share/ZUy0MY/twitter.jpeg)](https://x.com/tcdwww/status/1914202659210359108)

Fortunately, [@TBXark](https://x.com/TBXark) recommended his **MCP Proxy** project, which makes it very convenient to run MCP Server in Docker. His initial goal was to run MCP Server on a server to reduce client load and facilitate mobile client calls. However, Docker's inherent isolation features perfectly aligned with my requirement for a sandbox.

MCP Proxy runs MCP Servers in Docker and converts the protocol to MCP SSE, allowing users to make all calls via the SSE protocol from the MCP client. This can significantly reduce the risk of arbitrary file reading caused by directly running npx and uvx. *If deployed on an overseas server, it can also help solve network issues.*

However, it is currently still possible to read the `/config/config.json` configuration file of MCP Proxy, but the risk is manageable. I have also raised a feature request with the developer to configure the config file with 400 permissions and run the npx and uvx commands as the nobody user. If this can be implemented, it will perfectly solve the arbitrary file reading issue.

## Running MCP Proxy

[![MCP Proxy](https://github.html.zone/TBXark/mcp-proxy)](https://github.com/TBXark/mcp-proxy)

If you have your own VPS with Docker deployed, you can use the following command to run MCP Proxy.

```
docker run -d -p 9090:9090 -v /path/to/config.json:/config/config.json ghcr.io/tbxark/mcp-proxy:latest
```

If you don't have your own VPS, you can use the free container service provided by [**claw.cloud**](https://404.li/claw) ($5 credit per month, GitHub registration must be older than 180 days).

Since Claw has container size limitations, we need to use the following environment variables to configure the cache directories for npx and uvx to prevent container crashes.

```
UV_CACHE_DIR=/cache/uv
npm_config_cache=/cache/npm
```

Simultaneously mount 10GB of storage under the `/cache` path. Refer to my configuration: 0.5c CPU, 512M Memory, 10G Disk.

The final configuration is as follows:

![Claw](https://static.miantiao.me/share/g4KUgP/claw.jpg)

## Configuring MCP Proxy

The configuration file needs to be mounted at the `/config/config.json` path. For the complete configuration, please refer to [https://github.com/TBXark/mcp-proxy?tab=readme-ov-file#configurationonfiguration](https://github.com/TBXark/mcp-proxy?tab=readme-ov-file#configurationonfiguration).

Below is my configuration, for your reference.

```json
{
    "mcpProxy": {
        "baseURL": "https://mcp.miantiao.me",
        "addr": ":9090",
        "name": "MCP Proxy",
        "version": "1.0.0",
        "options": {
          "panicIfInvalid": false,
          "logEnabled": true,
          "authTokens": [
            "miantiao.me"
          ]
        }
    },
    "mcpServers": {
        "github": {
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-github"
            ],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
            }
        },
        "fetch": {
            "command": "uvx",
            "args": [
                "mcp-server-fetch"
            ]
        },
        "amap": {
            "url": "https://mcp.amap.com/sse?key=<YOUR_TOKEN>"
        }
    }
}
```

## Calling MCP proxy

Taking [**ChatWise**](https://404.li/chatwise) calling fetch as an example, just configure the SSE protocol directly.

![fetch](https://static.miantiao.me/share/mI3zIh/fetch.jpg)

Isn't it simple? When [**ChatWise**](https://404.li/chatwise) releases its mobile version, calling it this way will also be fully usable.

![ChatWise](https://static.miantiao.me/share/t43O9e/chatwise.jpg)