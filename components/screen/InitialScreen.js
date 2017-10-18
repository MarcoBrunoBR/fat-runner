((global, $page) => {

    global.InitialScreen = function(props){
        const state = {
            color: Colors.getColor()
        }

        const dummyPlayer = new Player()
        dummyPlayer.onClick(() => {
            dummyPlayer.rumbleController()
            state.color = Colors.getColor()
        })

        const render = (dom, {on}, onAnimationFrame) => {
            const $$dummyPlayer = new $$Player({
                id: 1
                ,controller: dummyPlayer.controller() 
            })

            const $element = dom`
                <div>
                    ${$$dummyPlayer}

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
                </div>
            `

            const $pontos =  $element.querySelector('.pontos')
            
            onAnimationFrame(() => {
                $page.style.backgroundColor = state.color
                $pontos.style.color = state.color
            })

            on("click", ".startOnePlayer", handleSinglePlayerStart)
            on("click", ".startTwoPlayers", handleTwoPlayersStart)

            return $element
        }

        const handleSinglePlayerStart = function(event){
            Game.state(GameState.SINGLE_PLAYER)
        }

        const handleTwoPlayersStart = function(event){
            Game.state(GameState.SETUP_ONLINE_2PLAYER)
        }

        return {render}
    }

})(window, window.gameScreen, document.dom, Objectz.extends, DOMComponent, Colors)

