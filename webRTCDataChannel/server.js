

'use strict'

import { WebSocketServer } from 'ws'
import express from 'express'
import url from 'url'

const CLIENTS = new Set()
const wss = new WebSocketServer({ noServer: true })
wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress

    CLIENTS.add(ws)
    if (CLIENTS.size > 2) console.log('More than 2 clients')
    ws.onclose = (e) => {
        console.log(`WS Connexion from ${ip} closed.`)
    }

    ws.onerror = (e) => {
        console.log(`WS Error from ${ip}: `, e)
    }

    ws.onmessage = async (e) => {
        const message = e.data
        console.log(`WS Message from ${ip}: `, message)

        // broadcast
        for (const c of CLIENTS) {
            if (c !== ws) {
                c.send(message)
            }
        }
    }

    ws.onopen = (e) => {
        console.log(`WS Open from ${ip}: `, message)
    }
})

const app = express()

app.use(express.static(url.fileURLToPath(new URL('./', import.meta.url))))

const server = app.listen(80)

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
        wss.emit("connection", websocket, request)
    })
})

