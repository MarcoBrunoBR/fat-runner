((global) => {

    global.InitialScreen = function(props){
        return Objectz.compose(Component, {
            render: () => render(props)
        })
    }

    const render = (props) => {
        const $component = new DOMComponent()
        $component.html(`
            <button id="startOnline">
                Jogar com alguém do outro lado do mundo
            </button>
            <button id="startOffline">
                Jogar com alguém do seu lado
            </button>
        `)
        $component.on("click", "#startOnline", handleOnlinePlayerStart)
        $component.on("click", "#startOffline", handleOfflinePlayerStart)
        return $component
    }

    const server = new Server("https://fatrunner-server.herokuapp.com")

    const handleOnlinePlayerStart = (event) => {
        server.connect()
            .then(connection => connection.findPlayer())
            .then(remoteMatch => {
                Game.state(GameState.ONLINE_START, {
                    remoteMatch
                })
            })
            .catch(error => {
                console.error(error)
                server.disconnect()
            })
    }

    const handleOfflinePlayerStart = (event) => {
        Game.state(GameState.OFFLINE_START)
    }

})(window, Objectz.compose, Component, DOMComponent, Server)
