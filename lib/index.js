http = require('http');

function createKiwiServer(){
    const server = http.createServer();
    server.on('request', (request, response) => {
      console.log(request);
    });
    return server;
}

exports.createKiwiServer = createKiwiServer;
