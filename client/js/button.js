(function(doc) {
  'use strict'

  let player1AndPlayer2 = 4

  const body = doc.querySelector('body')
  const colors = ['#1abc9c', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
  const pontos = doc.querySelector('.pontos')

  body.style.backgroundColor = colors[Math.round(Math.random()*7)]

  body.addEventListener('click', (event) => {
    const button = event.target;

    if (button.classList.contains('player1')) {
      player1AndPlayer2++
    }

    if (button.classList.contains('player2')) {
      player1AndPlayer2--
    }

    if (button.tagName == 'BUTTON') {
      body.style.backgroundColor = colors[Math.round(Math.random()*7)]
      pontos.querySelector('div').style.transform = `scaleX(${((player1AndPlayer2*100)/8)/100})`
    }
  })

  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, false);

  var lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 50) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
})(document)
