const { log_n, log_w } = require('../logger');
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/handlersContainer/commands').forEach(dir => {
        const files = fs.readdirSync(`./src/handlersContainer/commands/${dir}`).filter(file => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            return;
        }

        files.forEach((file) => {
            var command = require(`../handlersContainer/commands/${dir}/${file}`);
            if (command) {
                client.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach((alias) => {
                        client.aliases.set(alias, command.name);
                    });
                }
            } else {
                log_w(`Command: ${file} not loaded.`);
            }
        });
    });

    log_n('Commands loaded.');
}