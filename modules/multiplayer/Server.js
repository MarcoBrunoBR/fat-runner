((global) => {
    global.Server = function(ioInterface){
        let socket

        const connect = () => {
            return new Promise((resolve, reject) => {
                socket = ioInterface.connect();
                let connected = false
                socket.on('ok', function () {
                    connected = true
                    resolve(new ServerConnection(socket))
                });
                setTimeout(() => {
                    if(!connected){
                        socket.close()
                        reject("Can't connect to the servers ")
                    }
                }, 60/2 * 1000)
            })
        }

        const disconnect = () => {
            socket.disconnect()
        }

        return {
            connect: () => connect()
            ,disconnect: () => disconnect()
        }
    }

    
})(window, SocketIOIOInterface, ServerConnection)