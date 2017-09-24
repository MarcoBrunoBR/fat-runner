;((global) => {
    const sonicIOInterface = new SonicIOInterface()
    global.SonicServer = Server.bind(this, sonicIOInterface)
})(window, SonicIOInterface, Server)