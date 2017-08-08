((global) => {

  window.TwoPlayerOfflineScreen = function(){
    const twoPlayerOfflineMatch = new TwoPlayerMatch()

    const $$match = new $$Match({match: twoPlayerOfflineMatch})

    return $$match
  }

 })(window, $$Match, TwoPlayerMatch)
