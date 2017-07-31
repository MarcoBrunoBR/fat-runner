((global) => {

    global.BotMatch = function(oponent){

        const state = Object.seal({
            pointCounter: 10
        })

        const eventEmitter = new EventEmitter2({wildcard: true})

        oponent.on("sayIAmReadyToStart", () => {
            eventEmitter.emit("otherPlayerIsReady")
        })

        oponent.on("click", () => {
            state.pointCounter --
            eventEmitter.emit("updatePoints", state.pointCounter)
        })

        const handleClick = () => {
            oponent.emit("click")
            state.pointCounter++
            eventEmitter.emit("updatePoints", state.pointCounter)
        }

        return {
            click: () => handleClick()
            ,sayIAmReadyToStart: () => oponent.emit("sayIAmReadyToStart")
            ,onPointUpdate: (callback) => eventEmitter.on("updatePoints", () => callback(state.pointCounter))
        }
    }

})(window, EventEmitter2)