((global, $page) => {

  global.SinglePlayerScreen = function({botMatch} = {}) {
    const state = Object.seal({
      color: Colors.getColor()
      ,pointCounter: botMatch.MAX_POINTS / 2
      ,winner: undefined
      ,started: false
      ,startCounter: undefined
    })

    const MAX_POINTS = botMatch.MAX_POINTS

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
            <span class="pontos-texto"></span>
          </div>

          <div class="initCounter">
            <span class="initCounter-numero"></span>
          </div>

          <div class="player player--2">
            <button class="player-btn player-btn--2">
              <span>!</span>
            </button>
            <div class="player-shadow"></div>
          </div>
        </div>
      `

      const $msgVitoria = $element.querySelector('.pontos span')
      const $barraPontos = $element.querySelector('.pontos div')
      const $contador = $element.querySelector('.initCounter')
      const $contadorNumero = $element.querySelector('.initCounter-numero')
      const $playerBot = $element.querySelector('.player-btn--1')

      const {on: delegate} = new EventDelegator($element)

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $msgVitoria.style.color = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (!state.winner) {
          requestAnimationFrame(raf)
        }
        else {
          if (state.winner == 1) {
            $element.classList.add('wrapperPlayers--player1Won')
            $msgVitoria.textContent = "You Lose!"
          }
          if (state.winner == 2) {
            $element.classList.add('wrapperPlayers--player2Won')
            $msgVitoria.textContent = "You Win!"
          }
          delegate('transitionend', ".pontos-texto", () => {
            $element.classList.add('wrapperPlayers--openedOptions')
          })
        }
      })

      requestAnimationFrame(function raf(){
        if(state.startCounter != undefined){
          $contador.style.backgroundColor = state.startCounter == 0 && "transparent" || ""
          $contadorNumero.textContent = state.startCounter == 0 && "Go!" || state.startCounter
        }
        if (!state.started) {
          requestAnimationFrame(raf)
        } else {
          setTimeout(() => {
            $contador.style.display = "none"
          }, 500)
          $playerBot.classList.toggle('player-btn--active')
        }
      })  
      
      delegate('touchend', '.player-btn--2' , handleTouch)
      delegate('touchend', '.gameEndOptions-option--playAgain', handlePlayAgain)
      delegate('touchend', '.gameEndOptions-option--menu', handleMenu)

      return $element
    }

    const playerController = botMatch.getControllers()[0]

    const willMount = () => {
      BrowserCompatibility.setIphoneFix()
    }

    const didMount = () => {
      botMatch.onReadyToStart(() => (
        countdown(3)
      ))
      playerController.sayIAmReadyToStart()
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
      BrowserCompatibility.unsetIphoneFix()
    }

    const countdown = (from) => (
      new Promise((resolve, reject) => {
        state.startCounter = from
        const counterInterval = setInterval(() => {
          state.startCounter--
          if(state.startCounter == 0) {
            clearInterval(counterInterval)
            resolve()
          }
        }, 1000)
      })
    )

    const handleTouch = function(event) {
      if(!state.winner && state.started){
        playerController.click()
      }
    }

    botMatch.onStart(() => {
      state.started = true
    })

    botMatch.onUpdatePoints((points, winner) => {
      state.color = Colors.getColor()
      state.pointCounter = points
      state.winner = winner
    })

    const handlePlayAgain= (event) => {
      Game.state(GameState.SINGLE_PLAYER, {botMatch: new BotMatch()})
    }

    const handleMenu = (event) => {
      Game.state(GameState.INIT)
    }

    return Objectz.compose(Component, {
      render,willMount, didMount, willUnmount
    })
  }

 })(window, document.body, Object.seal, Objectz.compose, Component, BotMatch, EventDelegator, Colors)
