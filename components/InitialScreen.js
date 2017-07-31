((global, $page) => {

    const getColor = (() => {
      const colors = ['#1abc9c', '#2ecc71', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
      let previousColor
      return () => {
        const possibleColors = colors.filter(color => color != previousColor)
        previousColor = possibleColors[Math.round(Math.random()* (possibleColors.length - 1))]
        return previousColor
      }
    })()

    const server = new Server("https://fatrunner-server.herokuapp.com")

    global.InitialScreen = function(props){
        const state = {
            color: getColor(),
            startingGame: false
        }

        const render = (props) => {
            const $component = new DOMComponent()

            $component.html(`
                <div class="player player--1">
                    <button class="player-btn player-btn--1">
                        <span>!</span>
                    </button>
                    <div class="player-shadow"></div>
                </div>

                <div class="pontos">
                    <div class="startOnline pontos-barra pontos-barra--left">Online</div>
                    <div class="startOffline pontos-barra--right">Offline</div>
                </div>

                <nav class="navigation">
                    <figure class="navigation-item navigation-item--online">
                        <img class="startOnline" src="img/online.png">
                    </figure>

                    <figure class="navigation-item navigation-item--offline">
                        <img class="startOffline" src="img/offline.png">
                    </figure>
                </nav>
            `)

            $component.on("touchend", ".player", handleClickLogo)
            $component.on("click", ".startOnline", handleOnlinePlayerStart)
            $component.on("click", ".startOffline", handleOfflinePlayerStart)

            const $pontos =  $component.find('.pontos')
            requestAnimationFrame(function raf(){
                $page.style.backgroundColor = state.color
                $pontos.style.color = state.color
                if (!state.startingGame) requestAnimationFrame(raf)
            })

            return $component
        }

        const handleClickLogo = function(event){
            state.color = getColor()
        }

        const handleOnlinePlayerStart = function(event){
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

        const handleOfflinePlayerStart = function(event){
            Game.state(GameState.OFFLINE_START)
        }

        return Objectz.compose(Component, {
            render: () => render(props),
            willUnmount: () => {
                state.startingGame = true
            }
        })
    }

})(window, document.body,Objectz.compose, Component, DOMComponent, Server)

