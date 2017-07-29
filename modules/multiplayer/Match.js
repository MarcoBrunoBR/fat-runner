((global) => {

    global.Match = function(matchEmitter, matchReceiver){
        const eventEmitter = new EventEmitter2({wildcard: true})
        matchReceiver.on("click", () => {
            eventEmitter.emit("otherPlayerClicked")
        })

        return {
            click: () => matchEmitter.emit("click")
            ,on: (msg, callback) => eventEmitter.on(msg, callback)
        }
    }

})(window, EventEmitter2)