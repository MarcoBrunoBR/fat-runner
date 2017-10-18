;((global) => {
    global.IOSocketWithReceiveLogging = socketPromise => socketPromise.then(socket => {
        

        socket.onAny(function(headerString, data){
            const header = SonicDataParser.parseHeader(headerString)
            const messageName = header.messageName
            if(messageName === "receive_checksum_error"){
                console.error("Received with checksum error:", SonicDataParser.stringify(messageName, data))
            }
            else if(messageName !== "transmit_finish" && messageName !== "removeListener"){
                console.log("Received:", SonicDataParser.stringify(headerString, data))
            }
        })

        return socket
        
    })
})(window, SonicDataParser)

