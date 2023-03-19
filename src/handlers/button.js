const { log_n, log_w } = require('../logger');
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/handlersContainer/buttons').forEach(dir => {
        const files = fs.readdirSync(`./src/handlersContainer/buttons/${dir}`).filter(file => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            return;
        }

        files.forEach((file) => {
            var button = require(`../handlersContainer/buttons/${dir}/${file}`);
            if (button) {
                client.components.set(button.name, button);
            } else {
                log_w(`Button: ${file} not loaded.`);
            }
        });
    });

    log_n('Buttons loaded.');
}