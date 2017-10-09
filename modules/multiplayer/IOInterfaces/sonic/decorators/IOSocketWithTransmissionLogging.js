;((global) => {
    global.IOSocketWithTransmissionLogging = socketPromise => socketPromise.then(socket => {

        let lastData = ""

        socket.on("transmit_finish", () => {
            console.log("Finished transmiting:", lastData)
            lastData = ""
        })

        return Object.assign({}, socket, {
            emit: (eventName, data) => {
                const rawMessage = SonicDataParser.stringify(eventName, data)
                console.log("Transmitting: ", rawMessage)
                lastData += `\n    ${rawMessage}`
                socket.emit(eventName, data)
            }
        })
        
    })
})(window, SonicDataParser)

