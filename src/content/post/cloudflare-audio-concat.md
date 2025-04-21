---
layout: ../../layouts/post.astro
title: Use Cloudflare Workers to concat audio files
description: How to use Cloudflare Workers to merge audio files using FFmpeg in the browser.
dateFormatted: April 19, 2025
---

I recently updated the [Hacker News Chinese Podcast](https://hacker-news.agi.li/) to use a dual-speaker format. Since current speech synthesis models don't handle two-person dialogues very well, I needed a way to merge the audio files for each speaker.

The project runs on the Cloudflare Workers runtime, which lacks many Node.js features and cannot call C++ extensions. Furthermore, Cloudflare Containers aren't generally available yet. This meant I had to use the Browser Rendering API for the audio merging task.

FFmpeg is the standard tool for merging audio files, and fortunately, it can now run in the browser via WASM. So, the overall technical approach is:

1.  Use a Worker Binding to launch a browser instance (via the Browser Rendering API).
2.  Have the browser navigate to an audio merging page, perform the merge operation on the audio files, and return the result as a Blob.
3.  Receive the Blob back in the Worker and upload it to R2 storage.

The overall code footprint for this isn't large, but debugging was tricky because Browser Rendering runs remotely.

Here's the final implementation code:

### Browser-Side Audio Merging Code

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Audio</title>
  </head>
  <body>
    <script>
      const concatAudioFilesOnBrowser = async (audioFiles) => {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js'
        document.head.appendChild(script)
        await new Promise((resolve) => (script.onload = resolve))

        const { createFFmpeg, fetchFile } = FFmpeg
        const ffmpeg = createFFmpeg({ log: true })

        await ffmpeg.load()

        // Download and write each file to FFmpeg's virtual file system
        for (const [index, audioFile] of audioFiles.entries()) {
          const audioData = await fetchFile(audioFile)
          ffmpeg.FS('writeFile', `input${index}.mp3`, audioData)
        }

        // Create a file list for ffmpeg concat
        const fileList = audioFiles.map((_, i) => `file 'input${i}.mp3'`).join('\n')
        ffmpeg.FS('writeFile', 'filelist.txt', fileList)

        // Execute FFmpeg command to concatenate files
        await ffmpeg.run(
          '-f',
          'concat',
          '-safe',
          '0',
          '-i',
          'filelist.txt',
          '-c:a',
          'libmp3lame',
          '-q:a',
          '5',
          'output.mp3',
        )

        // Read the output file
        const data = ffmpeg.FS('readFile', 'output.mp3')

        // Create a downloadable link
        const blob = new Blob([data.buffer], { type: 'audio/mp3' })

        // Clean up
        audioFiles.forEach((_, i) => {
          ffmpeg.FS('unlink', `input${i}.mp3`)
        })
        ffmpeg.FS('unlink', 'filelist.txt')
        ffmpeg.FS('unlink', 'output.mp3')

        return blob
      }
    </script>
  </body>
</html>
```

### Worker Codes

```
export async function concatAudioFiles(audioFiles: string[], BROWSER: Fetcher, { workerUrl }: { workerUrl: string }) {
  const browser = await puppeteer.launch(BROWSER)
  const page = await browser.newPage()
  await page.goto(`${workerUrl}/audio`)

  console.info('start concat audio files', audioFiles)
  const fileUrl = await page.evaluate(async (audioFiles) => {
    // JS runs here in the browser.
    // @ts-expect-error Objects in the browser
    const blob = await concatAudioFilesOnBrowser(audioFiles)

    const result = new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return await result
  }, audioFiles) as string

  console.info('concat audio files result', fileUrl.substring(0, 100))

  await browser.close()

  const response = await fetch(fileUrl)
  return await response.blob()
}

const audio = await concatAudioFiles(audioFiles, env.BROWSER, { workerUrl: env.HACKER_NEWS_WORKER_URL })
return new Response(audio)
```

The above code is basically written by Cursor, and the final effect can be viewed at [Hacker News Code Repository](https://github.com/ccbikai/hacker-news/tree/main/worker).
