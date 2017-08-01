((global) => {
    global.BotMatch = function(MAX_POINTS = 20){

        const state = Object.seal({
            pointCounter: MAX_POINTS / 2
            ,winner: undefined
        })

        const match = new EventEmitter2({wildcard: true})
        
        const botPlayer = new EventEmitter2({wildcard: true})
        
        const player2 = new EventEmitter2({wildcard: true})


        let player2IsReady = false
        let botPlayerIsReady = false


        const startMatchIfEverybodyReady = (isReady1, isReady2) => {
            isReady1 && isReady2 && match.emit("readyToStart")
        }

        player2.on("sayIAmReadyToStart", () => {
            player2IsReady = true
            startMatchIfEverybodyReady(botPlayerIsReady, player2IsReady)
        })

        botPlayer.on("sayIAmReadyToStart", () => {
            botPlayerIsReady = true
            startMatchIfEverybodyReady(botPlayerIsReady, player2IsReady)
        })

        botPlayer.emit("sayIAmReadyToStart")

        const startBot = () => {
            setInterval(() => {
                state.pointCounter --
                match.emit("updatePoints", state.pointCounter)
                if (state.pointCounter == MAX_POINTS) {
                    state.winner = 2
                    match.emit("weHaveAWinner")
                } else if(state.pointCounter == 0){
                    state.winner = 1
                    match.emit("weHaveAWinner")
                }
            }, 200)
        }

        const handleClick = () => {
            state.pointCounter++
            match.emit("updatePoints", state.pointCounter)
            if (state.pointCounter == MAX_POINTS) {
                state.winner = 2
                match.emit("weHaveAWinner")
            } else if(state.pointCounter == 0){
                state.winner = 1
                match.emit("weHaveAWinner")
            }
        }

        return {
            MAX_POINTS
            ,click: () => handleClick()
            ,startMatch: () => startBot()
            ,sayIAmReadyToStart: () => player2.emit("sayIAmReadyToStart")
            ,onEnd: (callback) => match.on("weHaveAWinner", () => callback(state.winner))
            ,onPointUpdate: (callback) => match.on("updatePoints", () => callback(state.pointCounter))
            ,onReadyToStart: (callback) => match.on("readyToStart", () => callback())
        }
    }

})(window, EventEmitter2)