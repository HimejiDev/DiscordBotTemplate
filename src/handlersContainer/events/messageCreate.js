const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms');
const client = require('../../bot.js');
const { log_e, log_c } = require('../../logger');

const prefix = client.prefix;
const cooldown = new Collection();

client.on('messageCreate', async message => {
    try {
        // checks
        if (message.author.bot || message.channel.type !== 0 ||
            !message.content.startsWith(prefix)) return;

        // commands settings
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length == 0) return;
        const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))

        if (!command) return;

        if ((command.owner && (message.author.id != client.ownerId || message.channel.id != client.devChannel)) ||
            (command.dev && (!client.developerIds.includes(message.author.id) || message.channel.id != client.devChannel)))
            return;

        if (command.cooldown && cooldown.has(`${command.name}${message.author.id}`)) {
            const cooldownMessage = client.config.messages.cooldown.message.replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true }));
            if (client.config.messages.cooldown.embed.active) {
                const cooldownEmbed = new EmbedBuilder()
                    .setDescription(cooldownMessage)
                    .setColor(client.config.messages.cooldown.embed.color)
                return message.reply({ embeds: [cooldownEmbed] })
            } else
                return message.reply({ content: cooldownMessage });
        }

        if (command.userPerms || command.botPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                const userPermsMessage = client.config.messages.memberNoPermission.message.replace('<command.userPerms>', command.userPerms);
                if (client.config.messages.memberNoPermission.embed.active) {
                    const userPerms = new EmbedBuilder()
                        .setDescription(userPermsMessage)
                        .setColor(client.config.messages.memberNoPermission.embed.color)
                    return message.reply({ embeds: [userPerms] })
                } else
                    return message.reply({ content: userPermsMessage });
            }
            else if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                const botPermsMessage = client.config.messages.botNoPermission.message.replace('<command.botPerms>', command.botPerms);
                if (client.config.messages.botNoPermission.embed.active) {
                    const botPerms = new EmbedBuilder()
                        .setDescription(botPermsMessage)
                        .setColor(client.config.messages.botNoPermission.embed.color)
                    return message.reply({ embeds: [botPerms] })
                } else
                    return message.reply({ content: botPermsMessage });
            }
        }

        command.run(client, message, args)
        log_c(`${client.prefix}${command.name}`, message.author, message.guild, message.channel);

        if (command.cooldown) {
            cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                cooldown.delete(`${command.name}${message.author.id}`)
            }, command.cooldown);
        }
    }
    catch (error) {
        log_e(`${error}`, 'events/messageCreate.js');

        const errorMessage = client.config.messages.commandError.message;
        if (client.config.messages.commandError.embed.active) {
            const errorEmbed = new EmbedBuilder()
                .setDescription(errorMessage)
                .setColor(client.config.messages.commandError.embed.color)
            return message.reply({ embeds: [errorEmbed] })
        } else
            return message.reply({ content: errorMessage });
    }
});