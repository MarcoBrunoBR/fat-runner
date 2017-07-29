((global) => {

    global.InitialScreen = function(props){
        return {
            render: () => render(props)
        }
    }
    
    const render = (props) => {
        const $component = new DOMComponent()
        $component.html(`
            <button id="play">
                Jogar com alguém
            </button>
        `)
        $component.on("click", "#play", handleMultiPlayerStart)
        return $component.getElement()
    }

    const server = new Server("https://fatrunner-server.herokuapp.com")

    const handleMultiPlayerStart = (event) => {
        const serverConnectionPromise = server.connect()
        serverConnectionPromise
            .then(connection => connection.findPlayer())
            .then(match => {
                Screen.render(Game, {match})
            })
            .catch(error => {
                alert(error)
            })
    }

})(window, Objectz.compose, Component, DOMComponent, Server, Game)