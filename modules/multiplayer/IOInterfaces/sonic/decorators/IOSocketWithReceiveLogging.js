;((global) => {
    global.IOSocketWithReceiveLogging = socketPromise => socketPromise.then(socket => {
        

        socket.onAny(function(messageName, data){
            if(messageName !== "transmit_finish"){
                console.log("Received:", SonicDataParser.stringify(messageName, data))
            }
        })

        return socket
        
    })
})(window, SonicDataParser)

