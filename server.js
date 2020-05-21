const http = require('http');
const server = http.createServer();
const { connect, model } = require('mongoose');
connect(process.env.URI);
const User = model('User', {
	id: Number,
	bal: Number,
	ref: Number,
	refed: Number
});
server.on('request', function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.writeHead(200);
    // console.log(request.method);
    // console.log(request.headers);
    // console.log(request.url);
 
    var data = '';
    request.on('data', function(chunk) {
        //let user = await User.findOne({ id: context.senderId });

        data += chunk.toString();
    });
    request.on('end', function() {
        console.log(data);
        response.write('hi');
        response.end();
    });
 
});
server.listen(process.env.PORT);