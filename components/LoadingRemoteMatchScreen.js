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
        //quando o ser vivo clicar aqui me avisa
        match.click()

        //quando o o ser vivo do outro lado clicar eu te aviso
        match.on("otherPlayerClicked", function(){

        })
    }
})(window)