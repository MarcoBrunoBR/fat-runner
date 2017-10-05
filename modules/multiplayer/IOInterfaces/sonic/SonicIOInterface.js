;((global) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () => new SonicSocket()
        }
    }
})(window, SonicSocket)