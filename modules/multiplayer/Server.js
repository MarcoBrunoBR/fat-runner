((global) => {
    global.Server = function(ioInterface){
        let createSocketPromise 

        const connect = () => {
            createSocketPromise = ioInterface.createSocket()
            return new Promise((resolve, reject) => {
                createSocketPromise.then(s => {
                    socket = s
                    let connected = false
                    socket.on('connect', function () {
                        connected = true
                        resolve(new ServerConnection(socket))
                    });
                    socket.connect()
                    setTimeout(() => {
                        if(!connected){
                            socket.close()
                            reject("Can't connect to the servers ")
                        }
                    }, 60/2 * 1000)
                })
            })
        }

        const disconnect = () => {
            createSocketPromise && createSocketPromise.then(socket => socket.close())
        }

        return {
            connect: () => connect()
            ,disconnect: () => disconnect()
        }
    }

    
})(window, ServerConnection)