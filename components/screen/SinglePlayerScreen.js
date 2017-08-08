((global) => {

  global.SinglePlayerScreen = function() {
    const $$match = new $$Match({match: new BotMatch()})
    return $$match
  }

 })(window, $$Match, Match, BotMatch)
