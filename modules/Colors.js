((global)=>{
    const colors = ['#1abc9c', '#2ecc71', '#34495e', '#f1c40f', '#e67e22', '#e74c3c']
    let previousColor

    global.Colors = {
        getColor: () => {
            const possibleColors = colors.filter(color => color != previousColor)
            previousColor = possibleColors[Math.round(Math.random()* (possibleColors.length - 1))]
            return previousColor
        }
    }

})(window)