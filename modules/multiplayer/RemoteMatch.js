((global) => {

    global.RemoteMatch = function(matchConnection){
        const localPlayer = new Player()
        localPlayer.onClick(() => {
            matchConnection.emit("click")
        })

        const remotePlayer = new Player()
        const remoteplayerController = remotePlayer.controller()
        matchConnection.on("click", () => {
            remoteplayerController.click()
        })

        const withDummyController = player => Objectz.compose(player, {
            controller: () => Objectz.compose(player.controller(), {
                click: () => {console.log("Roubão")}
            })  
        })


        const match = new Match({
            MAX_POINTS: 20
            , initCountdownFrom: 5
            , player1: withDummyController(remotePlayer)
            , player2: localPlayer
        })

        return Objectz.compose(match, {
            disconnect: () => {
                matchConnection.emit("disconnect")
            }
            ,onUpdatePoints: (callback) => {
                match.onUpdatePoints(callback)
                matchConnection.on('abruptEnd', () => {
                    callback(20, 2)
                })
            }
        })
    }

})(window, Match, Player, Objectz.compose)