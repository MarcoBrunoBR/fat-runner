((global) => {
    global.Server = function(ioInterface){
        
        const connect = () => {
            createSocketPromise = ioInterface.createSocket()
            return new Promise((resolve, reject) => {
                createSocketPromise.then(s => {
                    socket = s
                    socket.on('connect', function () {
                        resolve(new ServerConnection(socket))
                    })

                    socket.on('connect_error', function(error){
                        socket.close()
                        reject(error)
                    })
                    
                    socket.connect()
                })
            })
        }

        return {
            connect: () => connect()
        }
    }

    
})(window, ServerConnection)