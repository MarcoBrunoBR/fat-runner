;((global, withTransmissionLogging, withReceiveLogging,withOpenProcedure, withSelfIdentification, withPlayerConnection, withSelfReceptionPrevention) => {
    global.SonicIOInterface = function(){
        return {
            createSocket: () =>
                withReceiveLogging(
                withSelfReceptionPrevention(
                withPlayerConnection(
                withOpenProcedure(    
                withSelfIdentification(   
                withTransmissionLogging(           
                    new SonicSocket()
                ))))))
        }
    }
})(window, IOSocketWithTransmissionLogging, IOSocketWithReceiveLogging, IOSocketWithOpenProcedure, IOSocketWithIdentity, IOSocketWithPlayerConnection, IOSocketWithSelfReceptionPrevention,SonicSocket)