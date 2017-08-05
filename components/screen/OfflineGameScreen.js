((global, $page) => {

  global.OfflineGameScreen = function({match} = {}) {

    const MAX_POINTS = match.MAX_POINTS
    const playerControllers = match.getControllers()

    const state = Object.seal({
      color: Colors.getColor()
      ,winner: undefined
      ,pointCounter: MAX_POINTS / 2
    })

    const render = () => {   

      const $element = document.dom`
        <div>
          <div class="player player--1">
            <button class="player-btn player-btn--1">
              <span>!</span>
            </button>
            <div class="player-shadow"></div>
          </div>

          <div class="gameEndOptions">
            <div class="gameEndOptions-wrapper gameEndOptions-wrapper--1">
              <button class="gameEndOptions-option gameEndOptions-option--menu">
                Menu
              </button>
              <button class="gameEndOptions-shadow"></button>
            </div>
            <div class="gameEndOptions-wrapper gameEndOptions-wrapper--2">
              <button class="gameEndOptions-option gameEndOptions-option--playAgain">
                Play Again
              </button>
            </div>
          </div>

          <div class="pontos">
            <div class="pontos-barra"></div>
            <span class="pontos-texto">You Win!</span>
          </div>

          <div class="player player--2">
            <button class="player-btn player-btn--2">
              <span>!</span>
            </button>
            <div class="player-shadow"></div>
          </div>
        </div>
      `

      const {on: delegate} = new EventDelegator($element)

      const $msgVitoria = $element.querySelector('.pontos span')
      const $barraPontos = $element.querySelector('.pontos div')
      const $options = $element.querySelector('.gameEndOptions')

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (!state.winner) {
          requestAnimationFrame(raf)
        }
        else {
          $msgVitoria.style.color = state.color
          if (state.winner == 1){
            $element.classList.add('wrapperPlayers--player1Won')
          }
          if (state.winner == 2) {
            $element.classList.add('wrapperPlayers--player2Won')
          }
          delegate('transitionend', ".pontos-texto", () => {
            $element.classList.add('wrapperPlayers--openedOptions')
          })
        }
      })

      delegate('touchend', ".player-btn--1", handlePlayer1)
      delegate('touchend', ".player-btn--2", handlePlayer2)

      delegate('touchend', '.gameEndOptions-option--playAgain', handlePlayAgain)
      delegate('touchend', '.gameEndOptions-option--menu', handleMenu)

      return $element
    }

    const willMount = () => {
      BrowserCompatibility.setIphoneFix()
    }

    const didMount = () => {
      playerControllers[0].sayIAmReadyToStart()
      playerControllers[1].sayIAmReadyToStart()
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
      BrowserCompatibility.unsetIphoneFix()
    }

    match.onUpdatePoints((points, winner) => {
      state.color = Colors.getColor()
      state.pointCounter = points
      state.winner = winner
    })

    const handlePlayer1 = (event) => {
      playerControllers[0].click()
    }

    const handlePlayer2 = (event) => {
      playerControllers[1].click()
    }

    const handlePlayAgain = (event) => {
      Game.state(GameState.OFFLINE_2PLAYER, {match: new Match()})
    }

    const handleMenu = (event) => {
      Game.state(GameState.INIT)
    }

    return Objectz.compose(Component, {
      render, willMount, didMount, willUnmount
    })
  }

 })(window, document.body, document.dom, Object.seal, Objectz.compose, Component, BrowserCompatibility, EventDelegator, Colors)
