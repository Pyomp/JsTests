



onmessage = (event) => {
    const sab = event.data

    const view = new DataView(sab)
    const update = () => {
        view.setFloat64(0, performance.now())
    }
    setInterval(update)
    postMessage('go')
}





