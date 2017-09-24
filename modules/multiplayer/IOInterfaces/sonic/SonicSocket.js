;((global) => {
    
    global.SonicSocket = function(){

        const emitter = new EventEmitter2()

        return {
            on: (eventName, cb) => emitter.on(eventName, cb)
            ,disconnect: () => {
                //TODO disconnect sonicSocket
            }
            ,close: () => {
                //TODO close sonicSocket
            }
        }
    }
})(window, EventEmitter2)