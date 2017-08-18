((global) => {
    global.Server = function(serverURL){
        let socket

        const connect = (serverURL) => {
            return new Promise((resolve, reject) => {
                socket = io.connect(serverURL);
                let connected = false
                socket.on('ok', function () {
                    connected = true
                    resolve(new ServerConnection(socket))
                });
                setTimeout(() => {
                    if(!connected){
                        socket.close()
                        reject("Can't connect to the server in " + serverURL)
                    }
                }, 60/2 * 1000)
            })
        }

        const disconnect = () => {
            socket.disconnect()
        }

        return {
            connect: () => connect(serverURL)
            ,disconnect: () => disconnect()
        }
    }

    
})(window, ServerConnection, io)