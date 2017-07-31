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
                    <div class="startOnePlayer pontos-barra pontos-barra--left">1 Player</div>
                    <div class="startTwoPlayers pontos-barra--right">2 players</div>
                </div>

                <nav class="navigation">
                    <figure class="navigation-item navigation-item--online">
                        <img class="startOnePlayer" src="img/online.png">
                    </figure>

                    <figure class="navigation-item navigation-item--offline">
                        <img class="startTwoPlayers" src="img/offline.png">
                    </figure>
                </nav>
            `)

            $component.on("touchend", ".player", handleClickLogo)
            $component.on("click", ".startOnePlayer", handleSinglePlayerStart)
            $component.on("click", ".startTwoPlayers", handleTwoPlayersStart)

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

        const handleSinglePlayerStart = function(event){
            Game.state(GameState.SINGLE_PLAYER)
        }

        const handleTwoPlayersStart = function(event){
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

