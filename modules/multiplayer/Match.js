((global) => {
    global.Match = function({MAX_POINTS = 20, player1, player2}){

        const state = Object.seal({
            pointCounter: MAX_POINTS / 2
            ,winner: undefined
        })

        const match = new EventEmitter2({wildcard: true})

        let player1IsReady = false
        let player2IsReady = false

        const startMatchIfEverybodyReady = (isReady1, isReady2) => {
            if(isReady1 && isReady2) {
                match
                    .emitAsync("readyToStart")
                    .then(() => {
                        player1.start()
                        player2.start()
                        match.emit("start")
                    })
            }
        }

        player2.onSayIAmReadyToStart(() => {
            player2IsReady = true
            startMatchIfEverybodyReady(player1IsReady, player2IsReady)
        })

        player1.onSayIAmReadyToStart(() => {
            player1IsReady = true
            startMatchIfEverybodyReady(player1IsReady, player2IsReady)
        })

        player1.onClick(() => {
            state.pointCounter --
            state.winner = getWinner()
            match.emit("updatePoints")
        })

        player2.onClick(() => {
            state.pointCounter++
            state.winner = getWinner()
            match.emit("updatePoints")
        })
        
        const getWinner = () => {
            if (state.pointCounter == MAX_POINTS) {
                return 2
            } else if(state.pointCounter == 0){
                return 1
            } else {
                return undefined
            }
        }

        return {
            MAX_POINTS
            ,onUpdatePoints: (callback) => match.on("updatePoints", () => callback(state.pointCounter, state.winner))
            ,onReadyToStart: (callback) => match.on("readyToStart", () => callback())
            ,onStart: (callback) => match.on("start", () => callback())
            ,getControllers: () => [
                player1.controller()
                ,player2.controller()
            ]
        }
    }

})(window, EventEmitter2)