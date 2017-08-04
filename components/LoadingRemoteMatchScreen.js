((global) => {

    const server = new Server("https://fatrunner-server.herokuapp.com")

    global.LoadingRemoteMatchScreen = function({match}){

        server.connect()
                .then(connection => connection.findPlayer())
                .then(remoteMatch => {
                    Game.state(GameState.ONLINE_START, {remoteMatch})
                })
                .catch(error => {
                    console.error(error)
                    server.disconnect()
                })
                
    }
})(window, Server)