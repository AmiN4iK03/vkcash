const { VK } = require('vk-io');
const db = require("./db.json");

const vk = new VK({
	token: process.env.TOKEN
});
updates.use(async (context, next) => {

    if (context.is("message") && context.isOutbox){
        return;
    }

    if (!db[context.senderId]) {
    	let user = await vk.api.users.get({
    		user_id: context.senderId
    	});
        db[context.senderId] = {
            ref: 0
        };
    }

    context.user = db[context.senderId];

    try {
        await next();
    } catch (err) { console.error(err) }
});
vk.updates.hear(/начать/i, context => (
	context.send(
`Здравствуй!

Заработай 1р за каждого реферала 💸
	
Повышай уровень в разделе "Прогресс", чтобы зарабатывать еще больше`)
));

vk.updates.start().catch(console.error);