const { log_n, log_w } = require('../logger');
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/handlersContainer/selectMenus').forEach(dir => {
        const files = fs.readdirSync(`./src/handlersContainer/selectMenus/${dir}`).filter(file => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            return;
        }

        files.forEach((file) => {
            var selectMenu = require(`../handlersContainer/selectMenus/${dir}/${file}`);
            if (selectMenu) {
                client.components.set(selectMenu.name, selectMenu);
            } else {
                log_w(`SelectMenu: ${file} not loaded.`);
            }
        });
    });

    log_n('SelectMenus loaded.');
}