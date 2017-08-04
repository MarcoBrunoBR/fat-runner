((global)=>{   
    
    const on = ({$element, eventName, elementSelector, callback, once = false}) => {
        if(elementSelector){
            const $eventElements = [...$element.querySelectorAll(elementSelector)]
            if($eventElements.length){
                $element.addEventListener(eventName, function handler(event){
                    if($eventElements.indexOf(event.target)+1){
                        callback.bind(this)(event)
                        if(once){
                            $element.removeEventListener(eventName, handler)
                        }
                    }
                })
            }
        } else {
            $element.addEventListener(eventName, function handler(event){
                callback.bind(this)(event)
                if(once){
                    $element.removeEventListener(eventName, handler)
                }
            })
        }
    }

    global.EventDelegator = function($domElement){
        if(!($domElement instanceof Element)){
            throw new Error("Can't delegate events on node that is not of type Element")
        }
        return {
            on: (eventName, ...otherArgs) => {
                let elementSelector
                let callback
                if(otherArgs.length == 2){
                    elementSelector = otherArgs[0]
                    callback = otherArgs[1]
                } else {
                    callback = otherArgs[0]
                }
                on({$element: $domElement, eventName, elementSelector, callback})
            }
            ,once: (eventName, ...otherArgs) => {
                let elementSelector
                let callback
                if(otherArgs.length == 2){
                    elementSelector = otherArgs[0]
                    callback = otherArgs[1]
                } else {
                    callback = otherArgs[0]
                }
                on({$element: $domElement, eventName, elementSelector, callback, once: true})
            }
        }
    }

})(window, Objectz.compose)