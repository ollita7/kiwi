function Put(path) {
    return function (object, methodName) {
        console.log(`${object}`);
    }
}
exports.Put = Put