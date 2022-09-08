

const wsOnMessageDispacher = {
    // offer
    '000': async (message) => {
        const data = JSON.parse(message)
        await peer.setRemoteDescription(data)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        ws.send('001' + JSON.stringify(peer.localDescription))
    },
    // answer 
    '001': (message) => {
        const data = JSON.parse(message)
        peer.setRemoteDescription(new RTCSessionDescription(data))
            .catch((e) => { console.log('Error setRemoteDescription(): ', e) })
    },
    // setup ice candidate
    '002': (message) => {
        const data = JSON.parse(message)
        peer.addIceCandidate(new RTCIceCandidate(data))
            .catch(e => { console.log('Error addIceCandidate(): ', e) })
    }
}

/**************/
/* Web Socket */
/**************/
const ws = new WebSocket('ws://localhost/')
ws.onopen = (e) => {
    console.log('WS open')
}

ws.onmessage = async (e) => {
    const message = e.data

    console.log('WS message: ', message)

    const cb = wsOnMessageDispacher[message.substring(0, 3)]
    if (cb) {
        cb(message.substring(3))
    } else {
        console.log('WS message callback unknown.')
    }
}
ws.onclose = (e) => {
    console.log('WS close')
}
ws.onerror = (e) => {
    console.log('WS error: ', e)
}

/***********/
/* Web RTC */
/***********/
const peer = new RTCPeerConnection()

// Set up on data channel offer
peer.ondatachannel = (e) => {
    const rtcDataChannel = e.channel
    rtcDataChannel.onmessage = (e) => {
        const message = e.data
        console.log('Channel onmessage: ' + message)
    }
    rtcDataChannel.onopen = (e) => {
        console.log('Channel onopen: ' + e)
    }
    rtcDataChannel.onclose = (e) => {
        console.log('Channel onclose: ' + e)
    }

    createOfferBtn.disabled = true

    pingBtn.onclick = () => {
        rtcDataChannel.send('ping')
    }
}

// Set up the ICE candidates
peer.onicecandidate = (e) => {
    if (e.candidate) {
        ws.send('002' + JSON.stringify(e.candidate))
    }
}

// button new chan (view)
const createOfferBtn = document.createElement('button')
createOfferBtn.innerHTML = 'createOffer'
document.body.appendChild(createOfferBtn)

createOfferBtn.addEventListener('click', async () => {

    // Create the data channel and establish its event listeners
    const rtcDataChannel = peer.createDataChannel("mainChan")
    rtcDataChannel.onmessage = (e) => {
        const message = e.data
        console.log('Channel onmessage: ' + message)
    }
    rtcDataChannel.onopen = () => {
        console.log(`channelCreat onopen`)
    }
    rtcDataChannel.onclose = () => {
        console.log(`channelCreat onclose`)
    }

    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    ws.send('000' + JSON.stringify(peer.localDescription))

    createOfferBtn.disabled = true

    pingBtn.addEventListener('click', () => {
        rtcDataChannel.send('ping')
    })
})

// button ping (onclick set in offer and )
const pingBtn = document.createElement('button')
pingBtn.innerHTML = 'pingBtn'
document.body.appendChild(pingBtn)
