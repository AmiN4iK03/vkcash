const { VK, Keyboard } = require("vk-io");
const db = require("./db.json");

const vk = new VK({
	token: process.env.TOKEN
});
vk.updates.use(async (context, next) => {

    if (context.is("message") && context.isOutbox){
        return;
    }

    if (!db[context.senderId]) {
        db[context.senderId] = {
			bal: 0,
			ref: 0,
			refed: 0
        };
    }

    context.user = db[context.senderId];

    try {
        await next();
    } catch (err) { console.error(err) }
});
vk.updates.hear(/начать/i, async (context) => (
	await context.send(
`Здравствуй!

Заработай 1р за каждого реферала 💸
	
Повышай уровень в разделе "Прогресс", чтобы зарабатывать еще больше`, {
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
					}),
					[
						Keyboard.textButton({
							label: '❓ Справка',
							color: Keyboard.PRIMARY_COLOR
					}),
					]
			]])
}))

);

vk.updates.hear(/прогресс/i, async (context) => (
	await context.send(
`[Уровень 0]

Сейчас вам доступно: 
+1р за каждого реферала.

Получи 1 уровень, чтобы открыть способность:
+17.5р за реферала

или

Получи сразу 2 уровень, чтобы открыть способность:
+52р за реферала`))

);

vk.updates.hear(/профиль/i, async (context) => {
	await context.send(
`0 УРОВЕНЬ.

Баланс: ${context.user.bal} руб

Рефералы: ${context.user.ref}

Зарабатывай, просто приглашая друзей
Тот кого Вы пригласили должен ввести: реф ${context.senderId}
Вы оба получите +1р
`)}

);

vk.updates.hear(/вывод/i, async (context) => {
	await context.send(
`Вывод доступен от 20р`)}

);

vk.updates.hear(/справка/i, async (context) => {
	await context.send(
`Правила проекта

1. Запрещается любого вида накрутка, буксы, а также использование нескольких аккаунтов

2. Работаем только со странами: РФ, Украина, Беларусь

Администрация оставляет за собой право заморозить баланс при наличии подозрений о накрутке и недобросовестности`)}

);

vk.updates.hear(/реф ([0-9]+)/i, async (context) => {
	if(!db[context.$match[1]]) {
		return context.send('Такого реферального кода нет');
	}
	else if(context.$match[1] == context.senderId) {
		return context.send('Нельзя вводить свой реферальный код');
	}
	else if(context.user.refed == 1) {
		return context.send('Вы уже вводили реферальный код');
	}
	context.user.refed = 1;
	context.user.bal += 1;
	db[context.$match[1]].ref += 1;
	db[context.$match[1]].bal += 1;
	await context.send(
`Вы получили +1р за введёный код`)
    await vk.api.messages.send({
	    user_ids: context.$match[1],
	    message: `Вы получили +1р за нового реферала`
})}

);

async function run() {
    await vk.updates.startPolling();
    console.log("Longpoll started");
}

run().catch(console.error);

setInterval(() => {
let db = require("./db.json");
require("fs").writeFileSync("./db.json", JSON.stringify(db, null, "\t"));
}, 2000);