((global, $page) => {
  // static props

  const getColor = (() => {
    const colors = ['#1abc9c', '#2ecc71', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
    let previousColor
    return () => {
      const possibleColors = colors.filter(color => color != previousColor)
      previousColor = possibleColors[Math.round(Math.random()* (possibleColors.length - 1))]
      return previousColor
    }
  })()

  global.OfflineGameScreen = function({match} = {}) {
    const state = Object.seal({
      color: getColor()
      ,winner: undefined
      ,pointCounter: 10
    })

    const MAX_POINTS = match.MAX_POINTS

    const render = () => {
      const $component = new DOMComponent()

      $component.html(`
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
      `)

      const $msgVitoria = $component.find('.pontos span')
      const $barraPontos = $component.find('.pontos div')
      const $options = $component.find('.gameEndOptions')

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (!state.winner) {
          requestAnimationFrame(raf)
        }
        else {
          $msgVitoria.style.color = state.color
          if (state.winner == 1){
            $component.addClass('wrapperPlayers--player1Won')
          }
          if (state.winner == 2) {
            $component.addClass('wrapperPlayers--player2Won')
          }
          $component.on('transitionend', ".pontos-texto", () => {
            $component.addClass('wrapperPlayers--openedOptions')
          })
        }
      })

      $component.on('touchend', ".player-btn--1", handlePlayer1)
      $component.on('touchend', ".player-btn--2", handlePlayer2)

      $component.on('touchend', '.gameEndOptions-option--playAgain', handlePlayAgain)
      $component.on('touchend', '.gameEndOptions-option--menu', handleMenu)

      BrowserCompatibility.setIphoneFix()

      return $component
    }

    const playerControllers = match.getControllers()

    const didMount = () => {
      playerControllers[0].sayIAmReadyToStart()
      playerControllers[1].sayIAmReadyToStart()
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
      BrowserCompatibility.unsetIphoneFix()
    }

    match.onUpdatePoints((points, winner) => {
      state.color = getColor()
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
      render,willUnmount
    })
  }

 })(window, document.body, Object.seal, Objectz.compose, Component, BrowserCompatibility)
