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

    function createFromNetworkEmitter (quietProfileName){

        const fromNetworkEmitter = new EventEmitter2()

        function onReceive(payload) {
            const rawData = Quiet.ab2str(payload)
            const message = SonicDataParser.parse(rawData)
            fromNetworkEmitter.emit(message.messageName, message.data)
        }

        function onReceiveFail(num_fails) {
            fromNetworkEmitter.emit("receive_error", num_fails)
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

        function onTransmitFinish() {
            toNetworkEmitter.emit("transmit_finish")
        }

        const transmitter = Quiet.transmitter({
            profile: quietProfileName
            ,onFinish: onTransmitFinish
        })

        toNetworkEmitter.onAny((eventName, value) => {
            if(eventName !== "transmit_finish"){
                const rawData = SonicDataParser.stringify(eventName, value)
                transmitter.transmit(Quiet.str2ab(
                    rawData
                ))
            }
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

                toNetworkEmitter.on("transmit_finish", function(){
                    fromNetworkEmitter.emit("transmit_finish")
                })

                return {
                    on: (eventName, cb) => fromNetworkEmitter.on(eventName, cb)
                    ,once: (eventName, cb) => fromNetworkEmitter.once(eventName, cb)
                    ,onAny: (cb) => fromNetworkEmitter.onAny(cb)
                    ,emit: (eventName, data) => toNetworkEmitter.emit(eventName, data)
                    ,removeAllListeners: eventName => fromNetworkEmitter.removeAllListeners(eventName)
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
})(window, EventEmitter2, SonicDataParser)
