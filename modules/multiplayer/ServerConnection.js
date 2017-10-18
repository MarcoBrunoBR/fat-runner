;((global) => {

    global.ServerConnection = function(serverSocket){
        return {
            findPlayers: () => findPlayers(serverSocket)
        }
    }

    const findPlayers = (socket) => {
        return new Promise((resolve, reject) => {
            const playerSearchEmitter = new EventEmitter2()

            socket.on("matchFound", (matchID) => {                
                playerSearchEmitter.emit('matchFound', matchID)
            })

            playerSearchEmitter.on('chooseMatch', (matchId) => {
                socket.connect(matchId).then(matchConnection => {
                    playerSearchEmitter.emit('matchConnection', matchConnection)
                })
            })

            socket.searchNearby()

            resolve(playerSearchEmitter)
        })
    }

})(window, RemoteMatch, EventEmitter2, Promise)