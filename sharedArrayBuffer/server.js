'use strict'

import express from 'express'
import url from 'url'

const app = express()

app.use(express.static(
    url.fileURLToPath(new URL('./', import.meta.url)),
    {
        setHeaders: function (res, path, stat) {
            res.set('Cross-Origin-Opener-Policy', 'same-origin')
            res.set('Cross-Origin-Embedder-Policy', 'require-corp')
        }
    })
)

app.listen(80)

