const { ApplicationCommandType, EmbedBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { log_w } = require('../../../logger');

module.exports = {
	name: 'ping',
	description: "Check bot's ping.",
	arguments: {},
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	type: ApplicationCommandType.ChatInput,
	run: async function (client, interaction) {
		try {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('primary')
						.setLabel('Click me!')
						.setStyle(ButtonStyle.Primary),
					// new StringSelectMenuBuilder()
					// 	.setCustomId('select')
					// 	.setPlaceholder('Nothing selected')
					// 	.addOptions(
					// 		{
					// 			label: 'Select me',
					// 			description: 'This is a description',
					// 			value: 'first_option',
					// 		},
					// 		{
					// 			label: 'You can select me too',
					// 			description: 'This is also a description',
					// 			value: 'second_option',
					// 		},
					// 	),
				);

			const embed = new EmbedBuilder()
				.setColor('#2B2D31')
				.setDescription(`> ${client.emotes.ping} Latency: **${Math.round(client.ws.ping)} ms**`)

			const msg = await interaction.reply({ embeds: [embed], components: [row] });
		} catch (error) {
			try {
				try {
					const errorMessage = client.config.messages.commandError.message;
					if (client.config.messages.commandError.embed.active) {
						const embed = new EmbedBuilder()
							.setDescription(errorMessage)
							.setColor(client.config.messages.commandError.embed.color)
						await interaction.update({ embeds: [embed], ephemeral: true });
					}
					else
						await interaction.update({ content: errorMessage, ephemeral: true });
				} catch {
					const errorMessage = client.config.messages.commandError.message;
					if (client.config.messages.commandError.embed.active) {
						const embed = new EmbedBuilder()
							.setDescription(errorMessage)
							.setColor(client.config.messages.commandError.embed.color)
						await interaction.reply({ embeds: [embed], ephemeral: true });
					}
					else
						await interaction.reply({ content: errorMessage, ephemeral: true });
				}
			} catch { }
			log_w(`Failed to execute '/ping'. ${error}`);
		}
	}
};