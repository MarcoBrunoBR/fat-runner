;((global) => {
    global.IOSocketWithOpenProcedure = socketPromise => socketPromise.then(socket => {

        const connectionEventsEmitter = new EventEmitter2()
        const connectionEvents = [
            "connect"
            ,"connect_error"
            ,"connect_timeout"
        ]
        
        let timeoutTimer, retryTimer
        let stopTimers = false
        const clearTimers = () => {
            stopTimers = true
            if(timeoutTimer){
                global.clearTimeout(timeoutTimer)
                timeoutTimer = undefined
            }
            if(retryTimer){
                global.clearTimeout(retryTimer)
                retryTimer = undefined
            }
        }

        const open = () => new Promise((resolve, reject) => {
            stopTimers = false

            const hardwareCheckupID = Math.ceil(Math.random() * 1000)
            const hardwareCheckup = SonicDataParser.stringifyHeader({origin: "self", destination: "self", messageName: "hC"})
            
            socket.once(hardwareCheckup, function(receivedHardwareCheckupID){
                if(receivedHardwareCheckupID == hardwareCheckupID){
                    clearTimers()
                    connectionEventsEmitter.emit("connect")
                }
            })

            retryTimer = setTimeout(function retry(){                
                socket.emit(hardwareCheckup, hardwareCheckupID)
                if(!stopTimers){
                    retryTimer = setTimeout(retry, 20000 / 20)
                }
            }, 20000 / 20)

            timeoutTimer = setTimeout(() => {
                clearTimers()
                connectionEventsEmitter.emit("connect_timeout")
                connectionEventsEmitter.emit("connect_error", new Error("Socket connection timedout"))
            }, 20000)
            
        })

        const listenWithHandler = (handler, cb, eventName) => {          
            if(handler === "onAny") {
                socket.onAny(cb)
                connectionEventsEmitter.onAny(cb)
            } else {
                const emitter = connectionEvents.indexOf(eventName) > -1 
                    ? connectionEventsEmitter
                    : socket

                emitter[handler](eventName, cb)
            }
        }

        return Object.assign({}, socket, {
            open: () => open()
            ,on: (eventName, callback) => listenWithHandler("on", callback, eventName)
            ,once: (eventName, callback) => listenWithHandler("once", callback, eventName)
            ,onAny: (callback) => listenWithHandler("onAny", callback)
            ,close: () => {
                clearTimers()
                socket.close()
            }
        })
        
    })
})(window, EventEmitter2)