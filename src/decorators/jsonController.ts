var index = require("../index");
export function JsonController(path: string| RegExp) {
    return function decorator(object: Object) {
        index.getMetadataStorage().controllers.push({
            path: path,
            target: object,
        })
    }
  }