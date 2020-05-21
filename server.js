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
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.writeHead(200);
    // console.log(request.method);
    // console.log(request.headers);
    // console.log(request.url);

    var data = '';
    request.on('data', function(chunk) {
        data += chunk;
    });
    request.on('end', function() {
        console.log(data.userid);
				let user = User.findOne({ id: data.userid });

				if(!user) {
					let $user = new User({
						id: data.userid,
						bal: 0,
						ref: 0,
						refed: 0
					});

					$user.save();
				}

        response.write('hi');
        response.end();
    });

});
server.listen(process.env.PORT);
