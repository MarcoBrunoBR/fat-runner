;((global) => {
    const sonicIOInterface = new SonicIOInterface()
    global.SonicServer = function(){
        return new Server(sonicIOInterface)
    }
})(window, SonicIOInterface, Server)