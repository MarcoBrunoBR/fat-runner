;((global) => {
    global.IOSocketWithLogging = socketPromise => socketPromise.then(socket => {
        let lastData = ""

        socket.onAny(function(messageName, data){
            if(messageName === "transmit_finish"){
                console.log("Finished transmiting:", lastData)
                lastData = ""
            } else {
                console.log("Received:", messageName)
            }
        })

        return Object.assign({}, socket, {
            emit: (eventName, data) => {
                console.log("Transmitting: ", `(${eventName}) -> ${data}`)
                lastData += `\n    (${eventName}) -> ${data}`
                socket.emit(eventName, data)
            }
        })
        
    })
})(window)

