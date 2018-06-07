http = require('http');
metadata = require('./metadata/metadataStorage');
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

__export(require("./decorators/get"));
__export(require("./decorators/post"));
__export(require("./decorators/put"));
__export(require("./decorators/jsonController"));
__export(require("./decorators/delete"));
__export(require("./types/kiwiOptions"));


function getMetadataStorage() {
  if (!global.metadataStorage)
      global.metadataStorage = new metadata.MetadataStorage();
  return global.metadataStorage;
}

exports.getMetadataStorage = getMetadataStorage

function createKiwiServer(options){
    console.log(getMetadataStorage());
    const server = http.createServer((request, response) => {
      switch(request.method){
        case 'POST':
          response.writeHead(200,{"Content-Type":"text\plain"});
          response.end(options.controllers[0].prototype['post'].apply(request, response));
          break;
        case 'GET':
          response.writeHead(200,{"Content-Type":"text\plain"});
          const controller_res = options.controllers[0].prototype['get'].apply(request, response);
          response.end(controller_res);
          break;
        case 'PUT':
        break;
        case 'DELETE':
        break;
      }
    });
    return server;
}

exports.createKiwiServer = createKiwiServer;
