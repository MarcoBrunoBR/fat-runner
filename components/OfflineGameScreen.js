((global, $page) => {

  const getColor = () => ['#1abc9c', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c'][
    Math.round(Math.random()*6)
  ]

  global.OfflineGameScreen = function() {
    const state = {
      color: getColor()
      ,isHappening: true
      ,pointCounter: 10
    }
    
    const render = () => {
      const $component = new DOMComponent()

      $component.html(`
        <div class="wrap-player1">
          <button class="player player1">
            <span>!</span>
          </button>
          <div class="sombra"></div>
        </div>

        <div class="pontos">
          <div></div>
          <span>You Win!</span>
        </div>

        <div class="wrap-player2">
          <button class="player player2">
            <span>!</span>
          </button>
          <div class="sombra"></div>
        </div>
      `)

      const $msgVitoria = $component.find('.pontos span')
      const $barraPontos = $component.find('.pontos div')

      requestAnimationFrame(function raf(){
        $page.style.backgroundColor = state.color
        $barraPontos.style.transform = `translateX(-${((state.pointCounter*100)/MAX_POINTS)}%)`
        if (state.isHappening) requestAnimationFrame(raf)
        else $msgVitoria.style.color = state.color
      })

      $component.on('touchend', handleTouch)

      return $component
    }

    const willUnmount = () => {
      $page.style.backgroundColor = ""
    }

    const MAX_POINTS = 20

    const startWinnerAnimation = function($component) {
      if (state.pointCounter == 0) $component.classList.add('wrapperPlayers--player1Won')
      if (state.pointCounter == MAX_POINTS) $component.classList.add('wrapperPlayers--player2Won')
      $component.addEventListener("animationend", () => {})
    }

    const handleTouch = function(event) {
      if(state.isHappening){
        const $origin = event.path[0]

        state.color = getColor()

        if ($origin.classList.contains('player1')) handlePlayer1()
        if ($origin.classList.contains('player2')) handlePlayer2()

        if (state.pointCounter == MAX_POINTS || state.pointCounter == 0) {
          state.isHappening = false
          startWinnerAnimation(this)
        }
      }
    }

    const handlePlayer1 = (event) => {
      state.pointCounter--
    }

    const handlePlayer2 = (event) => {
      state.pointCounter++
    }

    return Objectz.compose(Component, {
      render: () => render()
      ,willUnmount: () => willUnmount()
    })
  }

 })(window, document.body, Objectz.compose, Component)
