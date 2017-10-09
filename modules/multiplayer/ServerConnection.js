;((global) => {

    global.ServerConnection = function(serverSocket){
        return {
            findPlayer: () => findPlayer(serverSocket)
        }
    }

    const findPlayer = (socket) => {
        return new Promise((resolve, reject) => {
            socket.on("playerFound", (matchID) => {
                const emitToMatch = (msgName) => socket.emit(msgName)
                const receiveFromMatch = (msgName, callback) => socket.on(msgName, callback)

                resolve({emit: emitToMatch, on: receiveFromMatch})
            })
            socket.on("playerNotFound", () => {
                reject("Can't find a player for you right now :( Try again later =)")
            })
            socket.emit("findPlayer")
        })
    }

})(window, RemoteMatch, Promise)