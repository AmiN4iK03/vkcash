const { VK } = require('vk-io');

const vk = new VK({
	token: process.env.TOKEN
});

vk.updates.hear(/начать/i, context => (
	context.send(
`Здравствуй, ${vk[0].first_name} !

Заработай 1 р за каждого реферала 💸
	
Повышай уровень в разделе "Прогресс", чтобы зарабатывать еще больше.`)
));

vk.updates.start().catch(console.error);