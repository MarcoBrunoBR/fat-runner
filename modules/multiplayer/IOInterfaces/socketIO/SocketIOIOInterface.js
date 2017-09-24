;((global) => {

    global.SocketIOIOInterface = function(serverURL){
        return Object.assign({}, io, {
            connect: () => io.connect(serverURL)
        })
    }
})(window, io)