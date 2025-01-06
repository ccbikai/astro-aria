---
layout: ../../layouts/post.astro
title: Run Python in Your Browser Effortlessly
description: Run Python programs in the browser easily using Pyodide and WebAssembly for seamless execution of code and packages
dateFormatted: Dec 21, 2024
---

Microsoft recently open-sourced [MarkItDown](https://github.com/microsoft/markitdown), a program that converts Office files to Markdown format. The project quickly climbed to GitHub's trending list upon release.

However, since MarkItDown is a Python program, it might be challenging for non-technical users to use. To address this issue, I thought of using WebAssembly technology to run Python code directly in the browser.

Pyodide is an open-source program that runs Python in the browser, using WebAssembly to port CPython, so it supports all Python syntax. Cloudflare's Python Workers also use Pyodide.

> Pyodide is a port of CPython to WebAssembly/Emscripten.
>
> Pyodide makes it possible to install and run Python packages in the browser using micropip. Any pure Python package with wheels available on PyPI is supported.
>
> Many packages with C extensions have also been ported for use with Pyodide. These include common packages like regex, PyYAML, lxml, and scientific Python packages including NumPy, pandas, SciPy, Matplotlib, and scikit-learn. Pyodide comes with a robust JavaScript ⟺ Python foreign function interface that allows you to freely mix these languages in your code with minimal friction. This includes comprehensive support for error handling, async/await, and more.
>
> When used in the browser, Python has full access to the Web APIs.

Trying to run MarkItDown was surprisingly smooth, proving that WebAssembly is truly the future of browsers.

The main challenges faced and solutions:

1. **File Transfer Issue**: How to pass user-selected files to the Python runtime in the Worker?

2. **Dependency Installation Issue**: Limited access to PyPI in mainland China.

Eventually, we successfully implemented a MarkItDown tool that runs entirely in the browser. Feel free to try it out at [Office File to Markdown](https://www.html.zone/markitdown/).

[![Office File to Markdown](https://www.html.zone/markitdown.png)](https://www.html.zone/markitdown/)

Here's the core code for running Python in the Worker:

```javascript
// eslint-disable-next-line no-undef
importScripts('https://testingcf.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js')


async function loadPyodideAndPackages() {
  // eslint-disable-next-line no-undef
  const pyodide = await loadPyodide()
  globalThis.pyodide = pyodide

  await pyodide.loadPackage('micropip')

  const micropip = pyodide.pyimport('micropip')

  // micropip.set_index_urls([
  // 'https://pypi.your.domains/pypi/simple',  
  // ])

  await micropip.install('markitdown==0.0.1a2')
}

const pyodideReadyPromise = loadPyodideAndPackages()

globalThis.onmessage = async (event) => {
  await pyodideReadyPromise

  const file = event.data
  try {
    console.log('file', file)
    const startTime = Date.now()
    globalThis.pyodide.FS.writeFile(`/${file.filename}`, file.buffer)

    await globalThis.pyodide.runPythonAsync(`
from markitdown import MarkItDown

markitdown = MarkItDown()

result = markitdown.convert("/${file.filename}")
print(result.text_content)

with open("/${file.filename}.md", "w") as file:
  file.write(result.text_content)
`)
    globalThis.postMessage({
      filename: `${file.filename}.md`,
      content: globalThis.pyodide.FS.readFile(`/${file.filename}.md`, { encoding: 'utf8' }),
      time: Date.now() - startTime,
    })
  }
  catch (error) {
    globalThis.postMessage({ error: error.message || 'convert error', filename: file.filename })
  }
}
```
