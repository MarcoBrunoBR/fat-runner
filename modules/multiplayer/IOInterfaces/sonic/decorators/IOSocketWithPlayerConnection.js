;((global) => {
    global.IOSocketWithPlayerConnection = socketPromise => socketPromise.then(socket => {

        const anonAndFromOthersEmitter = new EventEmitter2()        
        const randomNumber = Math.ceil(Math.random() * 9999).toString()

        const fingerprintPromise = new Promise((resolve, reject) => {
            new Fingerprint2().get(function(result, components){
                resolve(result.substring(0,4))
            })
        })
        return fingerprintPromise.then(playerID => {
            console.log("The playerID is:", playerID)
            socket.onAny((eventName, data) => {
                const identityMatch = eventName.match(/\[(.+?)\]/)
                if(identityMatch){
                    const identity = identityMatch[1]
                    if(identity !== playerID){
                        anonAndFromOthersEmitter.emit(eventName, data)
                    }
                }else {
                    anonAndFromOthersEmitter.emit(eventName, data)
                }
            })
    
            return Object.assign({}, socket, {
                emit: (eventName, data) => socket.emit(`[${playerID}]${eventName}`, data)
                ,on: (eventName, cb) => anonAndFromOthersEmitter.on(eventName, cb)
                ,once: (eventName, cb) => anonAndFromOthersEmitter.once(eventName, cb)
                ,onAny: (cb) => anonAndFromOthersEmitter.onAny(cb)
            })
        })
    })
})(window, SonicDataParser, Fingerprint2)