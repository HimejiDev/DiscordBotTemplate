const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('../../bot.js');
const { log_e, log_c } = require('../../logger');

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
    const slashCommand = client.slashCommands.get(interaction.commandName);
    const component = client.components.get(interaction.customId);

    if (interaction.type == 1) { /* ping */ }
    else if (interaction.type == 2) { /* application command */
        if (!slashCommand) {
            const commandNotFoundMessage = client.config.messages.commandNotFound.message;
            try {
                if (client.config.messages.commandNotFound.active) {
                    const commandNotFoundEmbed = new EmbedBuilder()
                        .setDescription(commandNotFoundMessage)
                        .setColor(client.config.messages.embed.color)
                    await interaction.reply({ embeds: [commandNotFoundEmbed], ephemeral: true })
                } else
                    await interaction.reply({ content: commandNotFoundMessage, ephemeral: true })
            }
            catch {
                if (client.config.messages.commandNotFound.active) {
                    const commandNotFoundEmbed = new EmbedBuilder()
                        .setDescription(commandNotFoundMessage)
                        .setColor(client.config.messages.embed.color)
                    await interaction.update({ embeds: [commandNotFoundEmbed], ephemeral: true })
                } else
                    await interaction.update({ content: commandNotFoundMessage, ephemeral: true })
            }
            return client.slashCommands.delete(interaction.commandName);
        }

        try {
            if (slashCommand.cooldown && cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) {
                try {
                    const cooldownMessage = client.config.messages.cooldown.message.replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true }));
                    if (client.config.messages.cooldown.embed.active) {
                        const cooldownEmbed = new EmbedBuilder()
                            .setDescription(cooldownMessage)
                            .setColor(client.config.messages.cooldown.embed.color)
                        return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true })
                    } else
                        return interaction.reply({ content: cooldownMessage, ephemeral: true });
                }
                catch {
                    const cooldownMessage = client.config.messages.cooldown.message.replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), { long: true }));
                    if (client.config.messages.cooldown.embed.active) {
                        const cooldownEmbed = new EmbedBuilder()
                            .setDescription(cooldownMessage)
                            .setColor(client.config.messages.cooldown.embed.color)
                        return interaction.update({ embeds: [cooldownEmbed], ephemeral: true })
                    } else
                        return interaction.update({ content: cooldownMessage, ephemeral: true });
                }
            }

            if (slashCommand.userPerms || slashCommand.botPerms) {
                if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
                    const userPermsMessage = client.config.messages.memberNoPermission.message.replace('<command.userPerms>', slashCommand.userPerms);
                    try {
                        if (client.config.messages.memberNoPermission.embed.active) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(userPermsMessage)
                                .setColor(client.config.messages.memberNoPermission.embed.color)
                            return interaction.reply({ embeds: [userPerms], ephemeral: true })
                        } else
                            return interaction.reply({ content: userPermsMessage, ephemeral: true });
                    }
                    catch {
                        if (client.config.messages.memberNoPermission.embed.active) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(userPermsMessage)
                                .setColor(client.config.messages.memberNoPermission.embed.color)
                            return interaction.update({ embeds: [userPerms], ephemeral: true })
                        } else
                            return interaction.update({ content: userPermsMessage, ephemeral: true });
                    }
                }
                else if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
                    const botPermsMessage = client.config.messages.botNoPermission.message.replace('<command.botPerms>', slashCommand.botPerms);
                    try {
                        if (client.config.messages.botNoPermission.embed.active) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(botPermsMessage)
                                .setColor(client.config.messages.botNoPermission.embed.color)
                            return interaction.reply({ embeds: [botPerms], ephemeral: true })
                        } else
                            return interaction.reply({ content: botPermsMessage, ephemeral: true });
                    }
                    catch {
                        if (client.config.messages.botNoPermission.embed.active) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(botPermsMessage)
                                .setColor(client.config.messages.botNoPermission.embed.color)
                            return interaction.update({ embeds: [botPerms], ephemeral: true })
                        } else
                            return interaction.update({ content: botPermsMessage, ephemeral: true });
                    }
                }
            }

            await slashCommand.run(client, interaction);
            log_c(`/${slashCommand.name}`, interaction.member.user, interaction.guild, interaction.channel);

            if (slashCommand.cooldown) {
                cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
                setTimeout(() => {
                    cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
                }, slashCommand.cooldown)
            }
        } catch (error) {
            log_e(`${error}`, 'events/interactionCreate.js;application command');
            console.error(error);

            const errorMessage = client.config.messages.commandError.message;
            try {
                try {
                    if (client.config.messages.commandError.embed.active) {
                        const errorEmbed = new EmbedBuilder()
                            .setDescription(errorMessage)
                            .setColor(client.config.messages.commandError.embed.color)
                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                    } else
                        return interaction.reply({ content: errorMessage, ephemeral: true });
                }
                catch {
                    if (client.config.messages.commandError.embed.active) {
                        const errorEmbed = new EmbedBuilder()
                            .setDescription(errorMessage)
                            .setColor(client.config.messages.commandError.embed.color)
                        return interaction.update({ embeds: [errorEmbed], ephemeral: true })
                    } else
                        return interaction.update({ content: errorMessage, ephemeral: true });
                }
            } catch { }
        }
    }
    else if (interaction.type == 3) { /* message component */
        if (!component) {
            const componentNotMessage = client.config.messages.componentNotFound.message;
            try {
                if (client.config.messages.componentNotFound.active) {
                    const componentNotEmbed = new EmbedBuilder()
                        .setDescription(componentNotMessage)
                        .setColor(client.config.messages.componentNotFound.embed.color)
                    return interaction.reply({ embeds: [componentNotEmbed], ephemeral: true })
                } else
                    return interaction.reply({ content: componentNotMessage, ephemeral: true })
            }
            catch {
                if (client.config.messages.componentNotFound.active) {
                    const componentNotEmbed = new EmbedBuilder()
                        .setDescription(componentNotMessage)
                        .setColor(client.config.messages.componentNotFound.embed.color)
                    return interaction.update({ embeds: [componentNotEmbed], ephemeral: true })
                } else
                    return interaction.update({ content: componentNotMessage, ephemeral: true })
            }
        }

        try {
            if (component.cooldown && cooldown.has(`component-${component.name}${interaction.user.id}`)) {
                try {
                    const cooldownMessage = client.config.messages.cooldown.message.replace('<duration>', ms(cooldown.get(`component-${component.name}${interaction.user.id}`) - Date.now(), { long: true }));
                    if (client.config.messages.cooldown.embed.active) {
                        const cooldownEmbed = new EmbedBuilder()
                            .setDescription(cooldownMessage)
                            .setColor(client.config.messages.cooldown.embed.color)
                        return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true })
                    } else
                        return interaction.reply({ content: cooldownMessage, ephemeral: true });
                }
                catch {
                    const cooldownMessage = client.config.messages.cooldown.message.replace('<duration>', ms(cooldown.get(`component-${component.name}${interaction.user.id}`) - Date.now(), { long: true }));
                    if (client.config.messages.cooldown.embed.active) {
                        const cooldownEmbed = new EmbedBuilder()
                            .setDescription(cooldownMessage)
                            .setColor(client.config.messages.cooldown.embed.color)
                        return interaction.update({ embeds: [cooldownEmbed], ephemeral: true })
                    } else
                        return interaction.update({ content: cooldownMessage, ephemeral: true });
                }
            }

            if (component.userPerms || component.botPerms) {
                if (!interaction.memberPermissions.has(PermissionsBitField.resolve(component.userPerms || []))) {
                    const userPermsMessage = client.config.messages.memberNoPermission.message.replace('<command.userPerms>', component.userPerms);
                    try {
                        if (client.config.messages.memberNoPermission.embed.active) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(userPermsMessage)
                                .setColor(client.config.messages.memberNoPermission.embed.color)
                            return interaction.reply({ embeds: [userPerms], ephemeral: true })
                        } else
                            return interaction.reply({ content: userPermsMessage, ephemeral: true });
                    }
                    catch {
                        if (client.config.messages.memberNoPermission.embed.active) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(userPermsMessage)
                                .setColor(client.config.messages.memberNoPermission.embed.color)
                            return interaction.update({ embeds: [userPerms], ephemeral: true })
                        } else
                            return interaction.update({ content: userPermsMessage, ephemeral: true });
                    }
                }
                else if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(component.botPerms || []))) {
                    const botPermsMessage = client.config.messages.botNoPermission.message.replace('<command.botPerms>', component.botPerms);
                    try {
                        if (client.config.messages.botNoPermission.embed.active) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(botPermsMessage)
                                .setColor(client.config.messages.botNoPermission.embed.color)
                            return interaction.reply({ embeds: [botPerms], ephemeral: true })
                        } else
                            return interaction.reply({ content: botPermsMessage, ephemeral: true });
                    }
                    catch {
                        if (client.config.messages.botNoPermission.embed.active) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(botPermsMessage)
                                .setColor(client.config.messages.botNoPermission.embed.color)
                            return interaction.update({ embeds: [botPerms], ephemeral: true })
                        } else
                            return interaction.update({ content: botPermsMessage, ephemeral: true });
                    }
                }
            }

            await component.run(client, interaction);
            log_c(`*${component.name}`, interaction.member.user, interaction.guild, interaction.channel);

            if (component.cooldown) {
                cooldown.set(`component-${component.name}${interaction.user.id}`, Date.now() + component.cooldown)
                setTimeout(() => {
                    cooldown.delete(`component-${component.name}${interaction.user.id}`)
                }, component.cooldown)
            }

        } catch (e) {
            log_e(`${error}`, 'events/interactionCreate.js;message component');

            const errorMessage = client.config.messages.commandError.message;
            try {
                try {
                    if (client.config.messages.commandError.embed.active) {
                        const errorEmbed = new EmbedBuilder()
                            .setDescription(errorMessage)
                            .setColor(client.config.messages.commandError.embed.color)
                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                    } else
                        return interaction.reply({ content: errorMessage, ephemeral: true });
                }
                catch {
                    if (client.config.messages.commandError.embed.active) {
                        const errorEmbed = new EmbedBuilder()
                            .setDescription(errorMessage)
                            .setColor(client.config.messages.commandError.embed.color)
                        return interaction.update({ embeds: [errorEmbed], ephemeral: true })
                    } else
                        return interaction.update({ content: errorMessage, ephemeral: true });
                }
            } catch { }
        }
    }
    else if (interaction.type == 4) { /* command auto complete */
        if (slashCommand.autocomplete) {
            const choices = [];
            await slashCommand.autocomplete(interaction, choices)
        }
    }
    else if (interaction.type == 5) { /* modal submit */ }
});