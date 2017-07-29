((global) => {
    global.Server = function(serverURL){
        return {
            connect: () => connect(serverURL)
        }
    }

    const connect = (serverURL) => {
        return new Promise((resolve, reject) => {
            const socket = io.connect(serverURL);
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
})(window, ServerConnection, io)