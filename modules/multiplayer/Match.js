((global) => {
    global.Match = function({MAX_POINTS = 20, initCountdownFrom = 0, player1, player2} = {}){
        
        const START_POINTS = MAX_POINTS / 2

        const state = Object.seal({
            pointCounter: MAX_POINTS / 2
            ,initCountdownFrom
            ,started: false
            ,winner: undefined
        })

        const match = new EventEmitter2({wildcard: true})

        let player1IsReady = false
        let player2IsReady = false

        const startMatchIfEverybodyReady = (isReady1, isReady2) => { 
            if(isReady1 && isReady2) {
                new Promise((resolve, reject) => {
                    match.emit("initialCountdown", state.initCountdownFrom)
                    if(state.initCountdownFrom){
                        setTimeout(function counterTimeout(){
                            state.initCountdownFrom--
                            match.emit("initialCountdown", state.initCountdownFrom)
                            if(state.initCountdownFrom === 0){
                                resolve()
                            } else {
                                setTimeout(counterTimeout, 1000)
                            }
                        }, 1000)
                    } else {
                        resolve()
                    }
                })
                .then(() => {
                    player1.start()
                    player2.start()
                    match.emit("start")
                    state.started = true
                })
            }
        }

        player2.onReadyToStart(() => {
            player2IsReady = true
            startMatchIfEverybodyReady(player1IsReady, player2IsReady)
        })

        player1.onReadyToStart(() => {
            player1IsReady = true
            startMatchIfEverybodyReady(player1IsReady, player2IsReady)
        })

        player1.onClick(() => {
            if(state.started){
                state.pointCounter --
                player1.rumbleController()
                state.winner = getWinner()
                match.emit("updatePoints")
            }
        })

        player2.onClick(() => {
            if(state.started){
                state.pointCounter++
                player2.rumbleController()
                state.winner = getWinner()
                match.emit("updatePoints")
            }
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
            ,START_POINTS
            ,onUpdatePoints: callback => match.on("updatePoints", () => callback(state.pointCounter, state.winner))
            ,onStart: callback => match.on("start", () => callback())
            ,onInitialCountdown: callback => match.on("initialCountdown", countdown => callback(countdown))
            ,getControllers: () => [
                player1.controller()
                ,player2.controller()
            ]
        }
    }

})(window, Player, EventEmitter2)