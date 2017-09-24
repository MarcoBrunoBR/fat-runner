((global) => {
    global.$$Player = function({id: playerID, controller: playerController}){
        
        const state = Object.seal({
            active: false
            ,mounted: false
        })

        const render = (dom, {on}, onAnimationFrame) => {
            const $element = dom`
                <div class="player player--${playerID}">
                    <button class="player-btn player-btn--${playerID}">
                        <span>!</span>
                    </button>
                    <div class="player-shadow"></div>
                </div>
            `

            const $playerBtn = $element.querySelector('.player-btn')

            onAnimationFrame(function(){
                $playerBtn.classList.toggle('player-btn--active', state.active)
            })

            on('touchend', '.player-btn', playerController.click)

            return $element
        }

        const didMount = () => {
            playerController.sayIAmReadyToStart()
        }

        playerController.onRumble(() => {
            state.active = true
            setTimeout(() => state.active = false, 50)
        })

        return {
            render, didMount
        }
    }
})(window, Objectz.extends, DOMComponent, document.dom)