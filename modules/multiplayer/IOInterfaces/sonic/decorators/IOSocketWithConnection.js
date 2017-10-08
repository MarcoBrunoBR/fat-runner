;((global) => {
    global.IOSocketWithConnection = socketPromise => socketPromise.then(socket => {

        const connectionEventsEmitter = new EventEmitter2()
        const connectionEvents = [
            "connect"
            ,"connect_error"
            ,"connect_timeout"
        ]

        const connect = () => new Promise((resolve, reject) => {

            let timeoutTimer

            const hardwareCheckupID = Math.ceil(Math.random() * 1000)
            
            socket.once(hardwareCheckupID, function(){
                if(timeoutTimer){
                    global.clearTimeout(timeoutTimer)
                    timeoutTimer = undefined
                }
                socket.removeAllListeners("receive_error")
                connectionEventsEmitter.emit("connect")
            })

            socket.once("receive_error", function(error){
                if(timeoutTimer){
                    global.clearTimeout(timeoutTimer)
                    timeoutTimer = undefined
                }
                socket.removeAllListeners(hardwareCheckupID)
                connectionEventsEmitter.emit("connect_error", new Error(error))
            })

            socket.emit(hardwareCheckupID)

            timeoutTimer = setTimeout(() => {
                connectionEventsEmitter.emit("connect_timeout")
                connectionEventsEmitter.emit("connect_error", new Error("Socket connection timedout"))
            }, 20000)
            
        })

        const listenWithHandler = (handler, cb, eventName) => {
            const emitter = connectionEvents.indexOf(eventName) > -1 
                ? connectionEventsEmitter
                : socket

            if(handler === "onAny") {
                emitter[handler](cb)
            } else {
                emitter[handler](eventName, cb)
            }
        }

        return Object.assign({}, socket, {
            connect: () => connect()
            ,on: (eventName, callback) => listenWithHandler("on", callback, eventName)
            ,once: (eventName, callback) => listenWithHandler("once", callback, eventName)
            ,onAny: (eventName, callback) => listenWithHandler("onAny", callback)
        })
        
    })
})(window)