const { VK } = require('vk-io');

const vk = new VK({
	token: 'ddaf745cabae36fc51dab5569f4cad9d7ac2f862aba7ab8f5a0db88f4dfb3a89844618bb6d825b8102968'
});

vk.updates.hear(/hello/i, context => (
	context.send('World!')
));

vk.updates.start().catch(console.error);