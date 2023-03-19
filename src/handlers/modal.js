const { log_n, log_w } = require('../logger');
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/handlersContainer/modals').forEach(dir => {
        const files = fs.readdirSync(`./src/handlersContainer/modals/${dir}`).filter(file => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            return;
        }

        files.forEach((file) => {
            var modal = require(`../handlersContainer/modals/${dir}/${file}`);
            if (modal) {
                client.components.set(modal.name, modal);
            } else {
                log_w(`Modal: ${file} not loaded.`);
            }
        });
    });

    log_n('Modals loaded.');
}