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

    const SonicDataParser = {}
    SonicDataParser.parse = rawData => ({messageName: rawData})
    SonicDataParser.stringify = (eventName, value) => eventName

    function createFromNetworkEmitter (quietProfileName){

        const fromNetworkEmitter = new EventEmitter2()

        function onReceive(payload) {
            const rawData = Quiet.ab2str(payload)
            const data = SonicDataParser.parse(rawData)
            fromNetworkEmitter.emit(data.messageName)
            console.log("Received: ", data.messageName)
        }

        function onReceiveFail(num_fails) {
            fromNetworkEmitter.emit("error", num_fails)
        }

        return Quiet.receiver({
            profile: quietProfileName
            ,onReceive: onReceive
            ,onReceiveFail: onReceiveFail
        }).then(receiver => {
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
            const rawData = SonicDataParser.stringify(eventName, value)
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

                    let timeoutTimer

                    const hardwareCheckupID = Math.ceil(Math.random() * 1000)
                    
                    fromNetworkEmitter.once(hardwareCheckupID, function(){
                        if(timeoutTimer){
                            global.clearTimeout(timeoutTimer)
                            timeoutTimer = undefined
                        }
                        fromNetworkEmitter.removeAllListeners("error")
                        fromNetworkEmitter.emit("connect")
                    })

                    fromNetworkEmitter.once("error", function(error){
                        if(timeoutTimer){
                            global.clearTimeout(timeoutTimer)
                            timeoutTimer = undefined
                        }
                        fromNetworkEmitter.removeAllListeners(hardwareCheckupID)
                        fromNetworkEmitter.emit("connect_error", new Error(error))
                    })

                    toNetworkEmitter.emit(hardwareCheckupID)

                    timeoutTimer = setTimeout(() => {
                        fromNetworkEmitter.emit("connect_timeout")
                        fromNetworkEmitter.emit("connect_error", new Error("Socket connection timedout"))
                    }, 20000)
                    
                })

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