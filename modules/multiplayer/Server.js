((global) => {
    global.Server = function(ioInterface){
        let createSocketPromise
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
                    
                    socket.open()
                })
            }) 
        }

        return {
            connect: () => connect()
            ,disconnect: () => createSocketPromise.then(socket => {
                socket.close()
            })
        }
    }

    
})(window, ServerConnection)