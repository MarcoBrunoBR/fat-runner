((global) => {

    global.Objectz = Object.seal({
        compose: (...objects) => Object.assign({}, ...objects)
    })

})(window, Object.seal, Object.assign)


