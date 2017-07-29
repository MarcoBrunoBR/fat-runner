((global)=>{

    global.DOMComponent = function(){

        const $domElement = document.createElement("div")

        return {
            html: (template) => {
                $domElement.innerHTML = template
            }
            ,on: (eventName, elementSelector, callback) => {
                const $eventElements = [...$domElement.querySelectorAll(elementSelector)]
                if($eventElements.length){
                    $domElement.addEventListener(eventName, (event) => {
                        if($eventElements.indexOf(event.target)+1){
                            callback(event)
                        }
                    })
                }
            }
            ,getElement: () => $domElement
        }
    }

})(window)