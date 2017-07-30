((global, $doc) => {
  global.OfflineGameScreen = function() {
    return {
      render: () => render()
    }
  }

  const $body = $doc.body
  const colors = ['#1abc9c', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']

  const render = () => {
    const $component = new DOMComponent()
    $body.style.backgroundColor = colors[Math.round(Math.random()*7)]

    $component.html(`
      <div class="wrap-player1">
        <button class="player player1">!</button>
        <div class="sombra"></div>
      </div>

      <div class="pontos">
        <div></div>
      </div>

      <div class="wrap-player2">
        <button class="player player2">!</button>
        <div class="sombra"></div>
      </div>
    `)

    $component.on('click', handlePontos)

    $component.on('touchend', handleTouch)

    return $component
  }

  const maxPoints = 20
  let player1AndPlayer2 = 10

  const handleTouch = function(event) {
    const $origin = event.path[0]

    console.log($origin)

    if ($origin.classList.contains('player1')) handlePlayer1()
    if ($origin.classList.contains('player2')) handlePlayer2()
    handlePontos.call(this)
  }

  const handlePlayer1 = (event) => {
    player1AndPlayer2++
  }

  const handlePlayer2 = (event) => {
    player1AndPlayer2--
  }

  const handlePontos = function(event){
    const $pontos = this.querySelector('.pontos')
    requestAnimationFrame(function(){
      $body.style.backgroundColor = colors[Math.round(Math.random()*7)]
      $pontos.querySelector("div").style.transform = `scaleX(${((player1AndPlayer2*100)/maxPoints)/100})`
    })
  }

})(window, document)
