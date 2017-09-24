;((global) => {

    global.ServerConnection = function(serverSocket){
        return {
            findPlayer: () => findPlayer(serverSocket)
        }
    }

    const findPlayer = (socket) => {
        return new Promise((resolve, reject) => {
            socket.on("playerFound", (matchID, playerID) => {
                const emitToMatch = (msgName) => socket.emit(matchID + "/" + msgName)
                const receiveFromMatch = (msgName, callback) => socket.on(matchID + "/" + msgName, callback)
                resolve({emit: emitToMatch, on: receiveFromMatch})
            })
            socket.on("playerNotFound", () => {
                reject("Can't find a player for you right now :( Try again later =)")
            })
            socket.emit("findPlayer")
            setTimeout(() => reject("Can't find a player for you right now :( Try again later =)"), (60/2) * 1000)
        })
    }

})(window, RemoteMatch, Promise)