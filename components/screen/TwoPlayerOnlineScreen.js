((global) => {

  window.TwoPlayerOnlineScreen = function({remoteMatch}){

    const state = Object.seal({
      gameEnd: false
    })

    remoteMatch.onUpdatePoints((points, winner) => {
      if(winner) state.gameEnd = true
    })

    const $$match = new $$Match({match: remoteMatch})

    const render = (dom) => {
      return dom`${$$match}`
    }

    const willUnmount = () => {
      if(!state.gameEnd){
        remoteMatch.disconnect()
      }
    }

    return Objectz.extends(DOMComponent, {
      willUnmount, render
    })
  }

 })(window, $$Match, TwoPlayerMatch, Objectz.extends)
