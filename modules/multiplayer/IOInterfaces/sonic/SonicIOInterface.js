;((global, withTransmissionLogging, withReceiveLogging,withOpenProcedure, withSelfIdentification, withPlayerConnection) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () =>
                withPlayerConnection(
                withReceiveLogging(                
                withSelfIdentification(
                withOpenProcedure(    
                withTransmissionLogging(            
                    new SonicSocket()
                )))))
        }
    }
})(window, IOSocketWithTransmissionLogging, IOSocketWithReceiveLogging, IOSocketWithOpenProcedure, IOSocketWithIdentity, IOSocketWithPlayerConnection ,SonicSocket)