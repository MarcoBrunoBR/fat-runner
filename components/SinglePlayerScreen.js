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

      $component.on('touchend', '.player2' , handleTouch)

      return $component
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
    }

    const handleTouch = function(event) {
      if(!state.winner){
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
