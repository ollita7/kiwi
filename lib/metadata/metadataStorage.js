var MetadataStorage = (function () {
    
    function MetadataStorage(){
        this.actions = [];
        this.controllers = [];
    }

    MetadataStorage.prototype.addAction = function (path, method, target) {
        this.actions.push({
            path: path,
            method: method,
            target: target,
        })
    };
    return MetadataStorage;
}());
exports.MetadataStorage = MetadataStorage;