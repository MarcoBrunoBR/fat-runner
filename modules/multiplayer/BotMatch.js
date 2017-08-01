((global) => {

    global.BotMatch = function(){

        const state = Object.seal({
            pointCounter: 10
        })

        const eventEmitter = new EventEmitter2({wildcard: true})

        const oponent = new EventEmitter2({wildcard: true})

        oponent.on("sayIAmReadyToStart", () => {
            eventEmitter.emit("otherPlayerIsReady")
        })

        const startBot = () => {
            setInterval(() => {
                state.pointCounter --
                eventEmitter.emit("updatePoints", state.pointCounter)
            }, 200)
        }

        const handleClick = () => {
            state.pointCounter++
            eventEmitter.emit("updatePoints", state.pointCounter)
        }

        return {
            click: () => handleClick()
            ,startMatch: () => startBot()
            ,sayIAmReadyToStart: () => oponent.emit("sayIAmReadyToStart")
            ,onPointUpdate: (callback) => eventEmitter.on("updatePoints", () => callback(state.pointCounter))
            ,onReadyToStart: (callback) => eventEmitter.on("otherPlayerIsReady", () => callback())
        }
    }

})(window, EventEmitter2)