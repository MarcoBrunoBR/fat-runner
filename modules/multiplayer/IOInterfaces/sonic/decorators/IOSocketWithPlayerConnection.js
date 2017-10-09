;((global) => {
    global.IOSocketWithPlayerConnection = socketPromise => socketPromise.then(socket => {

        socket.onAny((eventName, data) => {
            
        })
   
        return socket

    })
})(window)