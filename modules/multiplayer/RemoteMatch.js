((global) => {

    global.RemoteMatch = function(me, oponent){

        const state = Object.seal({
            color: getColor()
            ,winner: undefined
            ,pointCounter: 10
        })

        const eventEmitter = new EventEmitter2({wildcard: true})

        oponent.on("sayIAmReadyToStart", () => {
            eventEmitter.emit("otherPlayerIsReady")
        })

        oponent.on("click", () => {
            state.pointCounter --
            eventEmitter.emit("updatePoints")
        })

        me.on("click", () => {
            state.pointCounter++
            eventEmitter.emit("updatePoints")
        })

        return {
            click: () => me.emit("click")
            ,sayIAmReadyToStart: () => me.emit("sayIAmReadyToStart")
            ,onPointUpdate: (callback) => eventEmitter.on("updatePoints", () => callback(state.pointCounter))
        }
    }

})(window, EventEmitter2)