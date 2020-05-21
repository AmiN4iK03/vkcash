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

    var data = {};
		var user;
    request.on('data', function(chunk) {
        data = JSON.parse(chunk);
    });
    request.on('end', function() {
				user = User.findOne({ id: data.userid });

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
		request.post('https://vkcash.herokuapp.com/', {
			json: {
				bal: user.bal
			}
		});


});
server.listen(process.env.PORT);
