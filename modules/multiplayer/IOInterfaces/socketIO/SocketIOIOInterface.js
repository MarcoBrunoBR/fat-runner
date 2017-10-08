;((global) => {

    global.SocketIOIOInterface = function(serverURL){
        return {
            createSocket: () => Promise.resolve(
                io(serverURL, {autoConnect: false})
            )
        }
    }
})(window, io)