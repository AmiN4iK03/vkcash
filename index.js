const http = require('http');
const server = http.createServer();
console.log('runned');
server.listen(81);

const { VK, Keyboard } = require("vk-io");
const { connect, model } = require('mongoose');
connect(process.env.URI);

const vk = new VK({
	token: process.env.TOKEN
});
const User = model('User', {
	id: Number,
	bal: Number,
	ref: Number,
	refed: Number
});
vk.updates.use(async (context, next) => {

    if (context.is("message") && context.isOutbox){
        return;
	}
	let user = await User.findOne({ id: context.senderId });

	if(!user) {
		let $user = new User({
			id: context.senderId,
			bal: 0,
			ref: 0,
			refed: 0
		});

		await $user.save();
	}

    try {
        await next();
    } catch (err) { console.error(err) }
});
vk.updates.hear(/начать/i, async (context) => (
	await context.send(
`👋 Здравствуйте!

💸 Заработайте 7р за каждого реферала
	
🔥 Повышайте уровень в разделе "Прогресс", чтобы зарабатывать еще больше`, {
	keyboard:
	Keyboard.keyboard([
			[
					Keyboard.textButton({
							label: '🔥 Прогресс',
							color: Keyboard.PRIMARY_COLOR
					}),
					Keyboard.textButton({
							label: '🏡 Профиль',
							color: Keyboard.PRIMARY_COLOR
					}),
					Keyboard.textButton({
							label: '💳 Вывод',
							color: Keyboard.PRIMARY_COLOR
					})
				],
				[
					Keyboard.textButton({
							label: '❓ Справка',
							color: Keyboard.PRIMARY_COLOR
					}),
			]])
}))

);

vk.updates.hear(/прогресс/i, async (context) => (
	await context.send(
`🔥 [Уровень 0]

👤 Сейчас Вам доступно: 
+7р за каждого реферала

⬆️ Получите 1 уровень, чтобы открыть способность:
+17.5р за реферала для этого переведите 50р на QIWI кошелек по ссылке: qiwi.com/n/AKCOOL с комментарием: 1lvl ${context.senderId}

или

🔝 Получите сразу 2 уровень, чтобы открыть способность:
+52р за реферала для этого переведите 100р на QIWI кошелек по ссылке: qiwi.com/n/AKCOOL с комментарием: 2lvl ${context.senderId}`))

);

vk.updates.hear(/профиль/i, async (context) => {
	let user = await User.findOne({ id: context.senderId });

	await context.send(
`🔥 0 УРОВЕНЬ.

💰 Баланс: ${user.bal}р

👥 Рефералы: ${user.ref}

😳 Зарабатывай, просто приглашая друзей
Тот кого Вы пригласили должен ввести: реф ${context.senderId}
Вы оба получите +7р
`)}

);

vk.updates.hear(/вывод/i, async (context) => {
	let user = await User.findOne({ id: context.senderId });

	if(user.bal < 100) {
		return context.send(`🚫 Вывод доступен от 100р`);
	}
	await context.send(
`❓ Для открытия доступа к выводу нужно подтвердить что Вы не нарушали правила проекта
Для этого переведите 50р на QIWI кошелек по ссылке: qiwi.com/n/AKCOOL с комментарием: ${context.senderId}
Деньги вернутся к Вам в течении 15 минут`)}

);

vk.updates.hear(/справка/i, async (context) => {
	await context.send(
`📖 Правила проекта

1⃣️ Запрещается любого вида накрутка, буксы, а также использование нескольких аккаунтов

2⃣️ Работаем только со странами: РФ, Украина, Беларусь

Администрация оставляет за собой право заморозить баланс при наличии подозрений о накрутке и недобросовестности`)}

);

vk.updates.hear(/реф ([0-9]+)/i, async (context) => {
	let user = await User.findOne({ id: context.senderId });
	let target = await User.findOne({ id: context.$match[1] });

	if(!target) {
		return context.send('🚫 Такого реферального кода нет');
	}
	else if(context.$match[1] == context.senderId) {
		return context.send('🚫 Нельзя вводить свой реферальный код');
	}
	else if(user.refed == 1) {
		return context.send('🚫 Вы уже вводили реферальный код');
	}
	user.refed = 1;
	user.bal += 7;
	target.ref += 1;
	target.bal += 7;
	user.save();
	target.save();
	await context.send(
`✅ Вы получили +7р за введенный код`)
    await vk.api.messages.send({
	    user_ids: context.$match[1],
	    message: `✅ Вы получили +7р за нового реферала`
})}

);

async function run() {
    await vk.updates.startPolling();
    console.log("Longpoll started");
}

run().catch(console.error);