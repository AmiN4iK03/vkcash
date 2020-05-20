const http = require('http');
const server = http.createServer();
console.log('runned');
server.on('request', function(request, response) {
    response.writeHead(200);
    console.log(request.method);
    console.log(request.headers);
    console.log(request.url);
 
    var data = '';
    request.on('data', function(chunk) {
        data += chunk.toString();
    });
    request.on('end', function() {
        console.log(data);
        response.write('hi');
        response.end();
    });
 
});
server.listen(process.env.PORT || 1337);