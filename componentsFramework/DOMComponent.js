((global) => {

    const DOMComponent = function(){
        return DOMComponent.prototype
    }

    DOMComponent.prototype = Object.freeze({
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
                if(typeof value.render === "function"){
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
                Promise.resolve(component.willMount && component.willMount())
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
                .then(() => Promise.resolve(component.didMount && component.didMount()))
                .then(() => lifecycleObserver.emit("mount"))
                .catch(error => console.error("DOMComponentLifeCycle: Error mounting component", error))
            )
            ,end : () => (
                Promise.all(
                    managedLifecycles.map(lifecycle => lifecycle.end())
                )
                .then(() => Promise.resolve(component.willUnmount && component.willUnmount()))
                .then(() => lifecycleObserver.emit("unmount"))
                .catch(error => console.error("DOMComponentLifeCycle: Error unmounting component", error))
            )
        }
    }
    
    const DOMComponentPlumber = function($domElement) {
        let unmountPreviousComponent = () => Promise.resolve()
        return {
            mount: component => unmountPreviousComponent()
                .then(() => {
                    const componentLifecycle = new DOMComponentLifeCycle(component, $domElement)
                    unmountPreviousComponent = componentLifecycle.end
                    const lifeCycleStartPromise = componentLifecycle.start()                
                    return lifeCycleStartPromise
                })
                .catch(error => console.error("DOMComponentPlumber: Error gluing Component to DOM", error))
        }
    }
        

    global.DOMComponent = DOMComponent
    global.DOMComponentPlumber = DOMComponentPlumber

})(window, Object.seal, document.dom, EventDelegator, EventEmitter2)