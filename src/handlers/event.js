const fs = require('fs');
const { log_n, log_w } = require('../logger');

module.exports = (client) => {
    fs.readdirSync(`./src/handlersContainer/events`).filter((file) => file.endsWith('.js')).forEach((eventFile) => {
        const event = require(`../handlersContainer/events/${eventFile}`);
        if (!event) {
            log_w(`Event: ${eventFile} not loaded.`);
        }
    });
    log_n('Events loaded.');
};