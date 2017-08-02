((global)=>{
    
    global.DOMComponent = function(){

        const $domElement = document.createElement("div")

        const on = ({eventName, elementSelector, callback, once = false}) => {
            if(elementSelector){
                const $eventElements = [...$domElement.querySelectorAll(elementSelector)]
                if($eventElements.length){
                    $domElement.addEventListener(eventName, function handler(event){
                        if($eventElements.indexOf(event.target)+1){
                            callback.bind(this)(event)
                            if(once){
                                $domElement.removeEventListener(eventName, handler)
                            }
                        }
                    })
                }
            } else {
                $domElement.addEventListener(eventName, function handler(event){
                    callback.bind(this)(event)
                    if(once){
                        $domElement.removeEventListener(eventName, handler)
                    }
                })
            }
        }

        return {
            html: (template) => {
                $domElement.innerHTML = template
            }
            ,find: (elementSelector) => $domElement.querySelector(elementSelector)
            ,findAll: (elementSelector) => [...$domElement.querySelectorAll(elementSelector)]
            ,addClass: (className) =>  $domElement.classList.add(className)
            ,on: (eventName, ...otherArgs) => {
                let elementSelector
                let callback
                if(otherArgs.length == 2){
                    elementSelector = otherArgs[0]
                    callback = otherArgs[1]
                } else {
                    callback = otherArgs[0]
                }
                on({element: $domElement, eventName, elementSelector, callback})
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
                on({element: $domElement, eventName, elementSelector, callback, once: true})
            }
            ,getElement: () => $domElement
        }
    }

})(window)