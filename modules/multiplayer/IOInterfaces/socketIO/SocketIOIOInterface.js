;((global) => {

    global.SocketIOIOInterface = function(serverURL){
        return {
            createSocket: () => new Promise((resolve, reject) => {
                const socket = io(serverURL, {
                    autoConnect: false
                })
                resolve(socket)
            })        
        }
    }
})(window, io)