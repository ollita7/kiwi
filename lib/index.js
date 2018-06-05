http = require('http');

function createKiwiServer(options){
    console.log(options);
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
