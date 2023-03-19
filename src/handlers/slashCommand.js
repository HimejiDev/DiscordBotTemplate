const { log_n, log_w, log_e } = require('../logger');
const fs = require('fs');
const chalk = require('chalk');

const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: '9' }).setToken(TOKEN);

module.exports = (client) => {
	const slashCommands = [];

	fs.readdirSync('./src/handlersContainer/slashCommands/').forEach(async dir => {
		const files = fs.readdirSync(`./src/handlersContainer/slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

		for (const file of files) {
			const slashCommand = require(`../handlersContainer/slashCommands/${dir}/${file}`);
			slashCommands.push({
				name: slashCommand.name,
				description: slashCommand.description,
				type: slashCommand.type,
				options: slashCommand.options ? slashCommand.options : null,
				default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
				default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
			});

			if (slashCommand.name) {
				client.slashCommands.set(slashCommand.name, slashCommand)
			} else {
				log_w(`SlashCommand: ${file} not loaded.`);
			}
		}

	});

	//const rest = new REST({ version: '9' }).setToken(TOKEN);

	(async () => {
		try {
			await rest.put(
				process.env.GUILD_ID ?
					Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID) :
					Routes.applicationCommands(CLIENT_ID),
				{ body: slashCommands }
			);
			log_n('SlashCommands loaded.');
		} catch (error) {
			log_e(error, 'handlers/slashCommands.js');
		}
	})();

};