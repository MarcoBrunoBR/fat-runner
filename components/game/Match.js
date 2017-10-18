((global, $page) => {

  global.$$Match = function({match} = {}) {
    const state = Object.seal({
      color: Colors.getColor()
      ,pointCounter: match.START_POINTS
      ,winner: undefined
      ,countdownText: undefined
      ,matchStarted: false
    })

    const MAX_POINTS = match.MAX_POINTS
    const [player1Controller, player2Controller] = match.getControllers()

    const render = (dom, {on}, onAnimationFrame) => {

      const $$player1 = new $$Player({
        id: 1
        ,controller: player1Controller
      })

      const $$player2 = new $$Player({
        id: 2
        ,controller: player2Controller
      })

      const $element = dom`
        <div>

          ${$$player1}

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

          ${$$player2}

        </div>
      `

      const $msgVitoria = $element.querySelector('.pontos span')
      const $barraPontos = $element.querySelector('.pontos div')
      onAnimationFrame((stop) => {
        $page.style.backgroundColor = state.color
        $msgVitoria.style.color = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if(state.winner){
          stop()
          if (state.winner == 1) {
            $element.classList.add('wrapperPlayers--player1Won')
            $msgVitoria.textContent = "You Lose!"
          }
          if (state.winner == 2) {
            $element.classList.add('wrapperPlayers--player2Won')
            $msgVitoria.textContent = "You Win!"
          }
        }
      })

      const $contador = $element.querySelector('.initCounter')
      const $contadorNumero = $element.querySelector('.initCounter-numero')
      onAnimationFrame((stop) => {
        if(state.countdownText){
          $contadorNumero.textContent = state.countdownText
        }
        if(state.matchStarted){
          stop()
          $contador.style.backgroundColor = "transparent"
          setTimeout(() => {
            $contador.style.display = "none"
          }, 500)
        }
      })  
      
      on('click', '.gameEndOptions-option--playAgain', handlePlayAgain)
      // on('touchend', '.gameEndOptions-option--playAgain', handlePlayAgain)
      on('click', '.gameEndOptions-option--menu', handleMenu)
      // on('touchend', '.gameEndOptions-option--menu', handleMenu)
      on('transitionend', ".pontos-texto", () => {
        $element.classList.add('wrapperPlayers--openedOptions')
      })

      return $element
    }

    const willMount = () => {
      BrowserCompatibility.setIphoneFix()
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
      BrowserCompatibility.unsetIphoneFix()
    }

    match.onInitialCountdown(number => {
      state.countdownText = ""
      if(number > 0){
        for(let i = 0; i < number; i++){
          state.countdownText+="I"
        }
      } else {
        state.countdownText="Go!"
      }
    })

    match.onStart(() => {
      state.matchStarted = true
    })

    match.onUpdatePoints((points, winner) => {
      state.color = Colors.getColor()
      state.pointCounter = points
      state.winner = winner
    })

    const handlePlayAgain= (event) => {
      Game.state("PREVIOUS")
    }

    const handleMenu = (event) => {
      Game.state(GameState.INIT)
    }

    return Objectz.extends(DOMComponent, {
      render,willMount, willUnmount
    })
  }

 })(window, window.gameScreen, Object.seal, Objectz.extends, DOMComponent, BotMatch, EventDelegator, Colors, $$Player)
