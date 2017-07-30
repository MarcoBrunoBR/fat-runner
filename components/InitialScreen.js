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
        const serverConnectionPromise = server.connect()
        serverConnectionPromise
            .then(connection => connection.findPlayer())
            .then(match => {
                Game.state(GameState.ONLINE_START)
            })
            .catch(error => {
                alert(error)
            })
    }

    const handleOfflinePlayerStart = (event) => {
        Game.state(GameState.OFFLINE_START)
    }

})(window, Objectz.compose, Component, DOMComponent, Server)
