http = require('http');
var _ = require('lodash');
metadata = require('./metadata/metadataStorage');
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

__export(require("./decorators/get"));
__export(require("./decorators/post"));
__export(require("./decorators/put"));
__export(require("./decorators/jsonController"));
__export(require("./decorators/delete"));
__export(require("./decorators/param"));
__export(require("./decorators/body"));
__export(require("./decorators/authorize"));
__export(require("./types/kiwiOptions"));

var internalOptions = {};

function getMetadataStorage() {
  if (!global.metadataStorage)
    global.metadataStorage = new metadata.MetadataStorage();
  return global.metadataStorage;
}
exports.getMetadataStorage = getMetadataStorage

function createKiwiServer(options) {
  internalOptions = options;
  getMetadataStorage().getRoutes();
  console.log(getMetadataStorage().routes);
  return http.createServer(processRequest);
}
exports.createKiwiServer = createKiwiServer;

async function processRequest(request, response) {
  if(request.method === 'OPTIONS' && internalOptions.cors){
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    return;
  }
  const match = getMetadataStorage().matchRoute(request.url, request.method);
  if (_.isNil(match)) {
    response.writeHead(404);
    response.end(`Method doesnt match`);
    return;
  }
  if (match.authorize) {
    if (!internalOptions.authorization.apply(null, match.roles)) {
      response.writeHead(401);
      response.end(`Not athorized`);
      return;
    }
  }
  params = match.paramValues;
  response.writeHead(200, { "Content-Type": "application\json" });
  if (request.method !== 'GET') {
    let body = await parseBody(request);
  }
 
  response.end(JSON.stringify(match.fn.apply(null, params)));
}

async function parseBody(request) {
  var p = new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => body += chunk);
    request.on('end', () => resolve(body));
  });

  var body = await p.then((body) => {
    return JSON.parse(body);
  });
  return body;
}
