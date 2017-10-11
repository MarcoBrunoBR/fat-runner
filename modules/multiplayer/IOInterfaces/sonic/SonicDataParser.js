;((global, withLogging, withConnection) => {

    const SonicDataParser = {}

    SonicDataParser.parse = rawData => {
        const parsedData = rawData.match(/\((.+?)\)->(.+)/)
        if(parsedData !== null && parsedData.length === 3){
            const headerString = parsedData[1]
            const data = parsedData[2]
            return {
                headerString: headerString
                ,data: data
            }
        } else {
            return null
        }
    }

    SonicDataParser.stringify = (headerString, value) => `(${headerString})->${value}`

    SonicDataParser.parseHeader = (headerString) => {
        const origin = getOrigin(headerString)
        const destination = getDestination(headerString)
        const messageName = getMessageName(headerString)
        return {
            origin
            ,destination
            ,messageName
        }
    }

    SonicDataParser.stringifyHeader = ({origin, destination, messageName}) => {
        if(!origin && !destination){
            return messageName
        } else {
            if(origin && destination){
                return withDestinationAndOrigin(destination, origin, messageName)
            } else if(origin){
                return withOrigin(origin, messageName)
            } else if(destination){
                return withDestination(destination, messageName)
            }
        }
    }

    const getOrigin = header => {
        const identityMatch = header.match(/\[(.+?)\]/)
        return identityMatch ? identityMatch[1] : null
    }

    const getDestination = header => {
        const identityMatch = header.match(/\{(.+?)\}/)
        return identityMatch ? identityMatch[1] : null
    }

    const getMessageName = header => {
        return header.replace(/\[(.+?)\]/, "").replace(/\{(.+?)\}/, "")
    }

    const withDestinationAndOrigin = (destId, originId, eventName) => {
        return `[${originId}]{${destId}}${eventName}`
    }

    const withDestination = (identity, eventName) => {
        return `{${identity}}${eventName}`
    }

    const withOrigin = (identity, eventName) => {
        return `[${identity}]${eventName}`
    }

    global.SonicDataParser = SonicDataParser
    
})(window)