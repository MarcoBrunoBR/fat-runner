((global) => {

    const DOMComponent = function(){
        return DOMComponent.prototype
    }

    DOMComponent.prototype = Object.seal({
        render: function(){
            throw new Error("Component didn't implement render function")
        }
        ,willUnmount: function(){
            return Promise.resolve()
        }
        ,willMount: function(){
            return Promise.resolve()
        }
        ,didMount: function(){
            return Promise.resolve()
        }
    })

    const DOMComponentTagFunction = function(managedLifecycles){  
        return function(strings, ...values){
            const parsedAsDOMValues = values.map(value => {                
                if(value instanceof DOMComponent){
                    const $template = document.createElement("template")
                    managedLifecycles.push(new DOMComponentLifeCycle(value, $template))
                    return $template
                } else {
                    return value
                }
            })
            return document.dom(strings, ...parsedAsDOMValues)
        }
    }

    //TODO Usar generator function aqui pra executar uma vez pro dummy e outra vez pro de vdd
    const DummyEventDelegator = function (eventMap){
        return {
            on: (eventName, ...otherArgs) => {
                 let elementSelector
                let callback
                if(otherArgs.length == 2){
                    elementSelector = otherArgs[0]
                    callback = otherArgs[1]
                } else {
                    elementSelector = undefined
                    callback = otherArgs[0]
                }
                if(!eventMap[eventName]) eventMap[eventName] = {}
                if(!eventMap[eventName][elementSelector]) eventMap[eventName][elementSelector] = {}
                if(!eventMap[eventName][elementSelector]['on']) eventMap[eventName][elementSelector]['on'] = []
                eventMap[eventName][elementSelector]['on'].push(callback)
            }
            ,once: (eventName, ...otherArgs) => {
                let elementSelector
                let callback
                if(otherArgs.length == 2){
                    elementSelector = otherArgs[0]
                    callback = otherArgs[1]
                } else {
                    elementSelector = undefined
                    callback = otherArgs[0]
                }
                if(!eventMap[eventName]) eventMap[eventName] = {}
                if(!eventMap[eventName][elementSelector]) eventMap[eventName][elementSelector] = {}
                if(!eventMap[eventName][elementSelector]['once']) eventMap[eventName][elementSelector]['once'] = []
                !eventMap[eventName][elementSelector]['once'].push(callback)
            }
        }
    }
    
    const DOMComponentUpdateRenderFunction = function(lifecycleObserver){
        return (renderFunction) => {
            let currentRAF = undefined

            const stopRequestAnimationFrame = () => {
                cancelAnimationFrame(currentRAF)
            }

            lifecycleObserver.on("mount", () => {
                currentRAF = requestAnimationFrame(function raf(){
                    currentRAF = requestAnimationFrame(raf)
                    renderFunction(stopRequestAnimationFrame)
                })
            })

            lifecycleObserver.on("unmount", stopRequestAnimationFrame)
        }
    }

    const DOMComponentBabysitter = function(lifecycleObserver, $elementCallback){
        const eventMap = {}
        const babyLifecycles = []

        let domComponentEventDelegator = new DummyEventDelegator(eventMap)
        let domComponentTagFunction = new DOMComponentTagFunction(babyLifecycles)
        let domComponentUpdateRenderFunction = new DOMComponentUpdateRenderFunction(lifecycleObserver)

        const $element = $elementCallback(domComponentTagFunction, domComponentEventDelegator, domComponentUpdateRenderFunction)

        domComponentEventDelegator = new EventDelegator($element)

        Object
            .keys(eventMap)
            .forEach(eventName => {
                Object.keys(eventMap[eventName]).forEach(selector => {
                    const handlers = eventMap[eventName][selector]
                    handlers.on && handlers.on.length && handlers.on.forEach(handler => {
                        if(selector == undefined){
                            domComponentEventDelegator.on(eventName, handler)
                        } else {
                            domComponentEventDelegator.on(eventName, selector, handler)
                        }
                    })
                    handlers.once && handlers.once.length && handlers.once.forEach(handler => {
                        if(selector == undefined){
                            domComponentEventDelegator.on(eventName, handler)
                        } else {
                            domComponentEventDelegator.on(eventName, selector, handler)
                        }
                    })
                })
            })

        return {babyLifecycles}
    }

    const DOMComponentLifeCycle = function(component, $domNode){
        let managedLifecycles
        const lifecycleObserver = new EventEmitter2();

        return {                
            start: () => (
                (component.willMount() || Promise.resolve())
                .then(() => {
                    $domNode.innerHTML = ''
                    return new DOMComponentBabysitter(lifecycleObserver, function(domComponentTagFunction, eventDelegator, onUpdateRender){
                        const $element = component.render(domComponentTagFunction, eventDelegator, onUpdateRender)

                        if($domNode.tagName == "TEMPLATE"){
                            $domNode.content.appendChild($element)
                            $domNode.parentNode.replaceChild($domNode.content, $domNode)
                        } else {
                            $domNode.appendChild($element)
                        }
                        
                        return $element
                    })
                })
                .then(({babyLifecycles}) => {
                    managedLifecycles = babyLifecycles
                    return Promise.all(managedLifecycles.map(lifecycle => lifecycle.start()))
                })
                .then(()=> (component.didMount() || Promise.resolve()))
                .then(() => lifecycleObserver.emit("mount"))
                .catch(error => console.error("Error mounting component", error))
            )
            ,end : () => (
                Promise.all(
                    managedLifecycles.map(lifecycle => lifecycle.end())
                )
                .then(() => component.willUnmount())
                .then(() => lifecycleObserver.emit("unmount"))
                .catch(error => console.error("Error unmounting component", error))
            )
        }
    }


    const DOMRootComponent = function($domElement){
        return {
            mount: (component) => {
                const lifecycles = new DOMComponentLifeCycle(component, $domElement)
                return lifecycles
                    .start()
                    .then(() => {
                        return () => lifecycles.end()
                    })
            }
        }
    }

    global.DOMComponent = DOMComponent
    global.DOMRootComponent = DOMRootComponent

})(window, Object.seal, document.dom, EventDelegator, EventEmitter2)