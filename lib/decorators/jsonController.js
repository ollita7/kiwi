var index = require("../index");
function JsonController(path) {
    return function decorator(object) {
        index.getMetadataStorage().controllers.push({
            path: path,
            target: object,
        })
    }
  }
exports.JsonController = JsonController