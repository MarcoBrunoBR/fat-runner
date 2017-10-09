;((global) => {

    global.ServerConnection = function(serverSocket){
        return {
            findPlayer: () => findPlayer(serverSocket)
            ,close: () => {
                if(findPlayerTimeout) {
                    global.clearTimeout(findPlayerTimeout)
                    findPlayerTimeout = undefined
                }
                serverSocket.close()
            }
        }
    }

    let findPlayerTimeout

    const findPlayer = (socket) => {
        return new Promise((resolve, reject) => {
            socket.on("playerFound", (matchID) => {
                if(findPlayerTimeout) {
                    global.clearTimeout(findPlayerTimeout)
                    findPlayerTimeout = undefined
                }

                const emitToMatch = (msgName) => socket.emit(msgName)
                const receiveFromMatch = (msgName, callback) => socket.on(msgName, callback)

                resolve({emit: emitToMatch, on: receiveFromMatch})
            })
            socket.on("playerNotFound", () => {
                if(findPlayerTimeout) {
                    global.clearTimeout(findPlayerTimeout)
                    findPlayerTimeout = undefined
                }
                reject("Can't find a player for you right now :( Try again later =)")
            })
            socket.emit("findPlayer")
            findPlayerTimeout = setTimeout(() => reject("Can't find a player for you right now :( Try again later =)"), (60/2) * 1000)
        })
    }

})(window, RemoteMatch, Promise)