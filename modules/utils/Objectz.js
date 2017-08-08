((global) => {

    const descriptors = object => {
        return Object
            .getOwnPropertyNames(object)
            .reduce((descriptors, propertyName) => {
                descriptors[propertyName] = Object.getOwnPropertyDescriptor(object, propertyName)
                return descriptors
            }, {})
    }

    const createPrototypeChain = (chain, currentObj) => {
        return Object.create(
            chain
            ,descriptors(currentObj)
        );
    }

    global.Objectz = Object.seal({
        extends: (Parent, children) => createPrototypeChain(new Parent(), children)
        ,compose: (...objects) => Object.assign({}, ...objects)
    })

})(window, Object.seal, Object.assign)


