'use strict'

const DURATION = 60_000

const worker = new Worker(new URL('./worker.js', import.meta.url))

const sab = new SharedArrayBuffer(8)
worker.postMessage(sab)
const dataView = new DataView(sab)

const times = []
const dtWorker = []

let lastNow = 0
// the performance.now() of the worker is different from the main
// so we need to sync this
let tSync = 0
let tStop = 0

const update = (now) => {
    const dt = now - lastNow
    lastNow = now
    tSync += dt
    times.push(tSync)

    const workerTime = dataView.getFloat64(0)
    dtWorker.push(tSync - workerTime)

    if (now > tStop) {
        console.log('finish')
        const TESTER = document.getElementById('tester')
        Plotly.newPlot(TESTER, [{
            x: times,
            y: dtWorker
        }], {
            margin: { t: 0 }
        })
    } else {
        requestAnimationFrame(update)
    }
}

worker.onmessage = () => {
    lastNow = performance.now()
    tSync = dataView.getFloat64(0)
    tStop = tSync + DURATION
    requestAnimationFrame(update)
}








