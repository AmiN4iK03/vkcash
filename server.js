const express = require('express');
var app = express();
const { connect, model } = require('mongoose');
connect(process.env.URI);
const User = model('User', {
	id: Number,
	bal: Number,
	ref: Number,
	refed: Number
});
app.use(express.json());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
});

app.post('/', async function (req, res) {
	let user = await User.findOne({ id: req.body.userid });
	if(!user) {
		let $user = new User({
			id: req.body.userid,
			bal: 0,
			ref: 0,
			refed: 0
		});

		await $user.save();
	}
	console.log(user.bal);
	res.sendStatus(200);
	res.send({test: 'text'});
});
app.listen(process.env.PORT);

// server.on('request', async function(request, response) {
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader('Access-Control-Allow-Headers', '*');
//     response.writeHead(200);
//     // console.log(request.method);
//     // console.log(request.headers);
//     // console.log(request.url);
//
//     var data = {};
//     request.on('data', function(chunk) {
//         data = JSON.parse(chunk);
//     });
//     request.on('end', async function() {
// 				let user = await User.findOne({ id: data.userid });
//
// 				if(!user) {
// 					let $user = new User({
// 						id: data.userid,
// 						bal: 0,
// 						ref: 0,
// 						refed: 0
// 					});
//
// 					await $user.save();
// 				}
//         response.write('hi');
//         response.end();
//     });
// 		http.request('http://vkcash.herokuapp.com/', {
// 		  method: 'POST',
// 		  headers: {
// 				'Accept': 'application/json',
// 		    'Content-Type': 'application/json',
// 		  },
// 			body: JSON.stringify({
// 				test: 'text'
// 			})
// 		})
//
//
//
// });
// server.listen(process.env.PORT);
