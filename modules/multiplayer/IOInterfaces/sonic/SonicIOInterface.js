;((global) => {
    
        global.SonicIOInterface = function(){
            let socket
            const connect = () => {
                socket = new SonicSocket()
                return socket
            }
            return {connect}
        }
    })(window, SonicSocket)