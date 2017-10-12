;((global) => {
    global.IOSocketWithIdentity = socketPromise => socketPromise.then(socket => {

        const identifiedMessagesEmitter = new EventEmitter2()        
        const randomNumber = Math.ceil(Math.random() * 99).toString().padStart(2,0)

        const fingerprintPromise = new Promise((resolve, reject) => {
            new Fingerprint2().get(function(result, components){
                resolve(result.substring(0,4) + randomNumber)
            })
        })
        
        return fingerprintPromise.then(myId => {
            console.log("The playerID is:", myId)
            socket.onAny((headerString, data) => { 
                const header = SonicDataParser.parseHeader(headerString)
                if(header.origin === myId){
                    header.origin = 'self'
                }
                if(header.destination === myId){
                    header.destination = 'self'
                }
                            
                identifiedMessagesEmitter.emit(SonicDataParser.stringifyHeader(header), data)
            })
    
            return Object.assign({}, socket, {
                emit: (headerString, data) => {
                    const header = SonicDataParser.parseHeader(headerString)
                    header.origin = myId
                    if(header.destination === 'self'){
                        header.destination = myId
                    }
                    socket.emit(SonicDataParser.stringifyHeader(header), data)
                }
                ,on: (eventName, cb) => identifiedMessagesEmitter.on(eventName, cb)
                ,once: (eventName, cb) => identifiedMessagesEmitter.once(eventName, cb)
                ,onAny: (cb) => identifiedMessagesEmitter.onAny(cb)
            })
        })
    })
})(window, SonicDataParser, Fingerprint2)