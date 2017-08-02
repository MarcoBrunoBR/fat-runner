((global, $page) => {
  const getColor = (() => {
    const colors = ['#1abc9c', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
    let previousColor
    return () => {
      const possibleColors = colors.filter(color => color != previousColor)
      previousColor = possibleColors[Math.round(Math.random()* (possibleColors.length - 1))]
      return previousColor
    }
  })()

  global.SinglePlayerScreen = function({botMatch} = {}) {
    const state = Object.seal({
      color: getColor()
      ,pointCounter: botMatch.MAX_POINTS / 2
      ,winner: undefined
      ,started: false
      ,startCounter: undefined
    })

    const MAX_POINTS = botMatch.MAX_POINTS

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
      `)

      const $msgVitoria = $component.find('.pontos span')
      const $barraPontos = $component.find('.pontos div')
      const $contador = $component.find('.initCounter')
      const $contadorNumero = $component.find('.initCounter-numero')
      const $playerBot = $component.find('.player-btn--1')

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (!state.winner) {
          requestAnimationFrame(raf)
        }
        else {
          $msgVitoria.style.color = state.color
          if (state.winner == 1) {
            $component.addClass('wrapperPlayers--player1Won')
            $msgVitoria.textContent = "You Lose!"
          }
          if (state.winner == 2) {
            $component.addClass('wrapperPlayers--player2Won')
            $msgVitoria.textContent = "You Win!"
          }
          $component.on('transitionend', ".pontos-texto", () => {
            $component.addClass('wrapperPlayers--openedOptions')
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
          $playerBot.classList.toggle('player-btn--bot')
        }
      })  
      
      $component.on('touchend', '.player-btn--2' , handleTouch)
      $component.on('touchend', '.gameEndOptions-option--playAgain', handlePlayAgain)
      $component.on('touchend', '.gameEndOptions-option--menu', handleMenu)

      return $component
    }

    const playerController = botMatch.getControllers()[0]

    const didMount = () => {
      botMatch.onReadyToStart(() => (
        countdown()
      ))
      playerController.sayIAmReadyToStart()
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
    }

    const countdown = () => (
      new Promise((resolve, reject) => {
        state.startCounter = 3
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
      state.color = getColor()
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
      render,willUnmount, didMount
    })
  }

 })(window, document.body, Object.seal, Objectz.compose, Component, BotMatch)
