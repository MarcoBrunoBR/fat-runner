;((global, withLogging, withConnection) => {

    const SonicDataParser = {}

    SonicDataParser.parse = rawData => {
        const parsedData = rawData.match(/\((.+?)\)->(.+)/)
        return {
            messageName: parsedData[1]
            ,data: parsedData[2]
        }
    }
        
    SonicDataParser.stringify = (eventName, value) => `(${eventName})->${value}`

    global.SonicDataParser = SonicDataParser
    
})(window)