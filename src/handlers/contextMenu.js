const { log_n, log_w } = require('../logger');
const fs = require('fs');

module.exports = (client) => {
    fs.readdirSync('./src/handlersContainer/contextMenus').forEach(dir => {
        const files = fs.readdirSync(`./src/handlersContainer/contextMenus/${dir}`).filter(file => file.endsWith('.js'));
        if (!files || files.length <= 0) {
            return;
        }

        files.forEach((file) => {
            var contextMenu = require(`../handlersContainer/contextMenus/${dir}/${file}`);
            if (contextMenu) {
                client.components.set(contextMenu.name, contextMenu);
            } else {
                log_w(`ContextMenu: ${file} not loaded.`);
            }
        });
    });

    log_n('ContextMenus loaded.');
}