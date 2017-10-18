;((global) => {
    global.IOSocketWithSelfReceptionPrevention = socketPromise => socketPromise.then(socket => {

        const onlyAdressedToMeEmitter = new EventEmitter2()

        socket.onAny((headerString, data) => { 
            const header = SonicDataParser.parseHeader(headerString)
            if(header.destination === 'self' || header.destination === null){
                onlyAdressedToMeEmitter.emit(headerString, data)
            }
        })
    
        return Object.assign({}, socket, {
            on: (eventName, cb) => onlyAdressedToMeEmitter.on(eventName, cb)
            ,once: (eventName, cb) => onlyAdressedToMeEmitter.once(eventName, cb)
            ,onAny: (cb) => onlyAdressedToMeEmitter.onAny(cb)
            ,offAny: (cb) => onlyAdressedToMeEmitter.offAny(cb)
            ,removeAllListeners: eventName => onlyAdressedToMeEmitter.removeAllListeners(eventName)
        })
    })
})(window, SonicDataParser, EventEmitter2)