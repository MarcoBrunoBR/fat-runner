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
            if(message !== null){
                fromNetworkEmitter.emit(message.headerString, message.data)
            } else {
                fromNetworkEmitter.emit("receive_error", rawData)
            }
        }

        function onReceiveFail(num_fails) {
            fromNetworkEmitter.emit("receive_checksum_error", num_fails)
        }

        return quietSetupPromise
            .then(() => 
                Quiet.receiver({
                    profile: quietProfileName
                    ,onReceive: onReceive
                    ,onReceiveFail: onReceiveFail
                })
            )
            .then(receiver => 
                Object.assign(
                    fromNetworkEmitter
                    , {destroy: () => receiver.destroy()}
                )
            )
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

        toNetworkEmitter.onAny((headerString, value) => {
            if(headerString !== "transmit_finish"){
                const rawData = SonicDataParser.stringify(headerString, value)
                transmitter.transmit(Quiet.str2ab(
                    rawData
                ))
            }
        })

        return quietSetupPromise
            .then(() => 
                Object.assign(
                    toNetworkEmitter
                    ,{destroy: () => transmitter.destroy()}
                )
            )
    }

    global.SonicSocket = function(){
        return Promise
            .all([createFromNetworkEmitter("audible"), createToNetworkEmitter("audible")])
            .then(([fromNetworkEmitter, toNetworkEmitter]) => {

                toNetworkEmitter.on("transmit_finish", function(){
                    fromNetworkEmitter.emit("transmit_finish")
                })

                return {
                    on: (eventName, cb) => fromNetworkEmitter.on(eventName, cb)
                    ,once: (eventName, cb) => fromNetworkEmitter.once(eventName, cb)
                    ,onAny: (cb) => fromNetworkEmitter.onAny(cb)
                    ,offAny: (cb) => fromNetworkEmitter.offAny(cb)
                    ,emit: (eventName, data) => toNetworkEmitter.emit(eventName, data)
                    ,removeAllListeners: eventName => fromNetworkEmitter.removeAllListeners(eventName)
                    ,close: () => {
                        console.log("FECHANDO")
                        fromNetworkEmitter.destroy()
                        toNetworkEmitter.destroy()
                        Quiet.disconnect()
                    }
                }
            })
            .catch(error => Promise.reject(new Error("SonicSocket: " + error)))
    }
})(window, EventEmitter2, SonicDataParser)
