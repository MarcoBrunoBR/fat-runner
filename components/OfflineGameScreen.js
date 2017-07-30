((global, $doc) => {
  global.OfflineGameScreen = function() {
    return {
      render: () => render()
    }
  }

  const $body = $doc.body
  const colors = ['#1abc9c', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
  const state = {}

  const render = () => {
    const $component = new DOMComponent()
    state.color = colors[Math.round(Math.random()*7)]
    state.isHappening = true

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

    const $pontos = $component.find('.pontos')
    requestAnimationFrame(function raf(){

      $body.style.backgroundColor = state.color
      $pontos.querySelector("div").style.transform = `translateX(-${((pointCounter*100)/maxPoints)}%)`
      if (state.isHappening) requestAnimationFrame(raf)
    })

    $component.on('touchend', handleTouch)

    return $component
  }

  const maxPoints = 20
  let pointCounter = 10

  const startWinnerAnimation = function(pointCounter, $component) {
    if (pointCounter == 0) $component.classList.add('wrapperPlayers--player1Won')
    if (pointCounter == maxPoints) $component.classList.add('wrapperPlayers--player2Won')
  }

  const handleTouch = function(event) {
    if(state.isHappening){
      const $origin = event.path[0]

      state.color = colors[Math.round(Math.random()*7)]

      if ($origin.classList.contains('player1')) handlePlayer1()
      if ($origin.classList.contains('player2')) handlePlayer2()

      if (pointCounter == maxPoints || pointCounter == 0) {
        state.isHappening = false
        this.querySelector('.pontos span').style.color = state.color
        startWinnerAnimation(pointCounter, this)
      }
    }
  }

  const handlePlayer1 = (event) => {
    pointCounter--
  }

  const handlePlayer2 = (event) => {
    pointCounter++
  }
})(window, document)
