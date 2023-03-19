const { log_d } = require('../../../logger');

module.exports = {
    name: 'primary',
    cooldown: 300,
    userPerms: [],
    botPerms: [],
    run: async function (client, interaction) {
        log_d('BUTTON PRESSED');
    }
};