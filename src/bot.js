const chalk = require('chalk');

// clear console
console.clear();
console.log(`${chalk.white('#')} - Normal | ${chalk.yellow('*')} - Warning | ${chalk.red('!')} - Error | ${chalk.cyan('%')} - Debug | ${chalk.green('$')} - Command\n`)

require('dotenv').config();

// setup discord.js
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { log_n, log_e } = require('./logger');

const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

// collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.components = new Collection();
client.aliases = new Collection();

// config
client.config = config;
client.prefix = config.prefix;
client.emotes = config.emotes;

// dev options
client.ownerId = process.env.BOT_OWNER_ID;
client.devChannel = process.env.DEVELOPER_CHANNEL;
client.developerIds = process.env.DEVELOPER_IDS.split(",");

// export bot
module.exports = client;

// handlers
['command', 'slashCommand', 'button', 'modal', 'contextMenu', 'selectMenu', 'event'].forEach((handler) => {
    try {
        require(`./handlers/${handler}`)(client);
    }
    catch (error) {
        log_e(`Handler: ${handler} failed to call. | ${error}`, 'bot.js');
    }
});

// login
client.login(process.env.TOKEN);