;((global) => {      
    
    const quietSetupPromise = new Promise((resolve, reject) => {
        return Quiet.init({
            profilesPrefix: "/vendor/quiet/"
            ,memoryInitializerPrefix: "/vendor/quiet/"
            ,libfecPrefix: "/vendor/quiet/"
            ,onReady: resolve
            ,onError: reject
        })
    })

    const SonicProtocol = {}
    SonicProtocol.parse = rawData => ({messageName: rawData})
    SonicProtocol.stringify = (eventName, value) => eventName

    function createFromNetworkEmitter (quietProfileName){

        const fromNetworkEmitter = new EventEmitter2()

        function onReceiverCreateFail(reason) {
            throw new Error("SonicIOInterface: failed to create receiver: " + reason);
        }

        function onReceive(payload) {
            const rawData = Quiet.ab2str(payload)
            const data = SonicProtocol.parse(rawData)
            fromNetworkEmitter.emit(data.messageName)
            console.log("Received: ", data.messageName)
        }

        function onReceiveFail(num_fails) {
            fromNetworkEmitter.emit("error")
        }

        return Quiet.receiver({
            profile: quietProfileName
            ,onCreateFail: onReceiverCreateFail
            ,onReceive: onReceive
            ,onReceiveFail: onReceiveFail
        })
        .then(receiver => {
            return Object.assign(fromNetworkEmitter, {
                destroy: () => receiver.destroy()
            })
        })
    }

    function createToNetworkEmitter (quietProfileName){
        const toNetworkEmitter = new EventEmitter2()

        let lastData

        function onTransmitFinish() {
            console.log("Finished trasmitting", lastData)
        }

        const transmitter = Quiet.transmitter({
            profile: quietProfileName
            ,onFinish: onTransmitFinish
        })

        toNetworkEmitter.onAny((eventName, value) => {
            const rawData = SonicProtocol.stringify(eventName, value)
            lastData = rawData
            console.log("Transmiting: ", rawData)
            transmitter.transmit(Quiet.str2ab(
                rawData
            ))
        })

        return Object.assign(toNetworkEmitter, {
            destroy: () => transmitter.destroy()
        })
    }

    global.SonicSocket = function(){
        return quietSetupPromise
            .then(() => createFromNetworkEmitter("audible"))
            .then(fromNetworkEmitter => ({
                fromNetworkEmitter: fromNetworkEmitter,
                toNetworkEmitter: createToNetworkEmitter("audible")
            }))
            .then(emitters => {
                const fromNetworkEmitter = emitters.fromNetworkEmitter
                const toNetworkEmitter = emitters.toNetworkEmitter

                const connect = () => new Promise((resolve, reject) => {
                    const hardwareCheckupID = Math.ceil(Math.random() * 1000)
                    
                    fromNetworkEmitter.on(hardwareCheckupID, function(){
                        resolve(emitters)
                    })
                    fromNetworkEmitter.on("error", function(){
                        reject("We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%.")
                    })

                    toNetworkEmitter.emit(hardwareCheckupID)

                    setTimeout(() => {
                        timedout = true
                        reject("SonicSocket: Timeout. Couldn't connect.")
                    }, (60/2) * 1000)
                    
                }).then(() => fromNetworkEmitter.emit("connect"))

                return {
                    on: (eventName, cb) => fromNetworkEmitter.on(eventName, cb)
                    ,emit: eventName => toNetworkEmitter.emit(eventName)
                    ,connect: () => connect()
                    ,close: () => {
                        fromNetworkEmitter.destroy()
                        toNetworkEmitter.destroy()
                        Quiet.disconnect()
                    }
                }
            })
            .catch(error => {
                console.error("SonicSocket: ", error)
                throw new Error("SonicSocket: " + error)
            })
    }
})(window, EventEmitter2)