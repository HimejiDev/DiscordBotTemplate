const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { log_w } = require('../../../logger');

module.exports = {
	name: 'ping',
	description: "Check bot's ping.",
	arguments: {},
	dev: false,
	owner: false,
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	aliases: [],
	run: async function (client, message, args) {
		try {
			const embed = new EmbedBuilder()
				.setColor('#2B2D31')
				.setDescription(`> ${client.emotes.ping} Latency: **${Math.round(client.ws.ping)} ms**`)

			const msg = await message.reply({ embeds: [embed] });
		} catch (error) {
			if (client.config.messages.commandError.embed.active) {
				const errorMessage = client.config.messages.commandError.message;
				const embed = new EmbedBuilder()
					.setDescription(errorMessage)
					.setColor(client.config.messages.commandError.embed.color)
				await message.reply({ embeds: [embed] });
			}
			else
				await message.reply({ embeds: [embed] });
			log_w(`Failed to execute '.ping'. ${error}`);
		}
	}
};