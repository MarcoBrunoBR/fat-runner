const configFile = require("./config")

module.exports = Object.seal(Object.assign(
    configFile, process.env
))