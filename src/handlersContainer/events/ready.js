const { ActivityType } = require('discord.js');
const client = require('../../bot');
const { log_n } = require('../../logger');
const chalk = require('chalk');

client.on("ready", () => {
	const activities = [
		{ name: `${client.guilds.cache.size} Servers`, type: ActivityType.Listening },
		{ name: `${client.channels.cache.size} Channels`, type: ActivityType.Playing },
		{ name: `${client.users.cache.size} Users`, type: ActivityType.Watching }
	];

	let i = 0;
	setInterval(() => {
		if(i >= activities.length) i = 0
		client.user.setActivity(activities[i])
		i++;
	}, 5000);

    log_n(`Logged in as ${chalk.cyan(client.user.tag)}. [${chalk.cyan(client.user.id)}]`);
});