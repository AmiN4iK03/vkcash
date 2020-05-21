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
server.on('request', async function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.writeHead(200);
    // console.log(request.method);
    // console.log(request.headers);
    // console.log(request.url);

    var data = {};
    request.on('data', function(chunk) {
        data = JSON.parse(chunk);
    });
    request.on('end', async function(request) {
				let user = await User.findOne({ id: data.userid });

				if(!user) {
					let $user = new User({
						id: data.userid,
						bal: 0,
						ref: 0,
						refed: 0
					});

					await $user.save();
				}
				request.post('https://vk.com/app7474504', {
					json: {
						bal: user.bal
					}
				});

        response.write('hi');
        response.end();
    });


});
server.listen(process.env.PORT);
