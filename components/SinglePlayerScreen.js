((global, $page) => {
  const MAX_POINTS = 20

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
      ,winner: undefined
      ,pointCounter: 10
      ,startCounter: undefined
      ,started: false
    })

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

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (!state.winner) {
          requestAnimationFrame(raf)
        }
        else {
          $msgVitoria.style.color = state.color
          if (state.winner == 1) $component.addClass('wrapperPlayers--player1Won')
          if (state.winner == 2) $component.addClass('wrapperPlayers--player2Won')
        }
      })

      requestAnimationFrame(function raf(){
        if(state.startCounter != undefined){
          $contador.classList.add("'.initCounter--active")
          $contadorNumero.innerText = state.startCounter == 0 && "Start!" || state.startCounter
        }
        if (!state.started) {
          requestAnimationFrame(raf)
        } else {
          setTimeout(() => {
            $contador.remove()
          }, 500)
        }
      })    

      $component.once('touchstart', '.player-btn--2' , handleStart)
      $component.on('touchend', '.player-btn--2' , handleTouch)

      return $component
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
    }

    const startCounter = () => (
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

    const handleStart = function(event){
      botMatch.onReadyToStart(() => {
        startCounter()
          .then(() => {
            state.started = true
            botMatch.startMatch()
          })
      })
      botMatch.sayIAmReadyToStart()
    }

    const handleTouch = function(event) {
      if(!state.winner && state.started){
        const $origin = event.path[0]

        state.color = getColor()
        botMatch.click()

        if (state.pointCounter == MAX_POINTS) {
          state.winner = 2
        } else if(state.pointCounter == 0){
          state.winner = 1
        }
      }
    }

    botMatch.onPointUpdate((points) => {
      state.pointCounter = points
    })

    return Objectz.compose(Component, {
      render,willUnmount
    })
  }

 })(window, document.body, Object.seal, Objectz.compose, Component)
