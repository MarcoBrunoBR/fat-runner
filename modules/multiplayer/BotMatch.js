((global) => {
    const MAX_POINTS = 20
    global.BotMatch = function(){

        const state = Object.seal({
            pointCounter: 10
            ,winner: undefined
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
                if (state.pointCounter == MAX_POINTS) {
                    state.winner = 2
                    eventEmitter.emit("weHaveAWinner")
                } else if(state.pointCounter == 0){
                    state.winner = 1
                    eventEmitter.emit("weHaveAWinner")
                }
            }, 200)
        }

        const handleClick = () => {
            state.pointCounter++
            eventEmitter.emit("updatePoints", state.pointCounter)
            if (state.pointCounter == MAX_POINTS) {
                state.winner = 2
                eventEmitter.emit("weHaveAWinner")
            } else if(state.pointCounter == 0){
                state.winner = 1
                eventEmitter.emit("weHaveAWinner")
            }
        }



        return {
            click: () => handleClick()
            ,startMatch: () => startBot()
            ,sayIAmReadyToStart: () => oponent.emit("sayIAmReadyToStart")
            ,onEnd: (callback) => eventEmitter.on("weHaveAWinner", () => callback(state.winner))
            ,onPointUpdate: (callback) => eventEmitter.on("updatePoints", () => callback(state.pointCounter))
            ,onReadyToStart: (callback) => eventEmitter.on("otherPlayerIsReady", () => callback())
        }
    }

})(window, EventEmitter2)