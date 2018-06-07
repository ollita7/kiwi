function Delete(path) {
    return function (object, methodName) {
        console.log(`${object}`);
    }
}
exports.Delete = Delete