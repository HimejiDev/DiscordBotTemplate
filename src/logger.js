const chalk = require('chalk');

function getDate() {
    var date = new Date();
    var timeDate;

    // day
    timeDate = (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
    timeDate += '/';

    // month
    timeDate += (date.getMonth() < 10 ? ('0' + date.getUTCMonth()) : date.getUTCMonth());
    timeDate += '/';

    // year
    timeDate += date.getFullYear();
    timeDate += ' ';

    // hour
    timeDate += (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours());
    timeDate += ':';

    // min
    timeDate += (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    timeDate += ':';

    // sec
    timeDate += (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    timeDate += ':';

    // milisec
    timeDate += (date.getMilliseconds() < 100 ? (date.getMilliseconds() < 10 ? ('00' + date.getMilliseconds()) : ('0' + date.getMilliseconds())) : date.getMilliseconds());

    return timeDate;
}

const pipe = chalk.dim(chalk.white('|'));
const leftBrack = chalk.dim(chalk.white('['));
const rightBrack = chalk.dim(chalk.white(']'));
function date() { return chalk.dim(chalk.white(`${chalk.bold(leftBrack)}${getDate()}${chalk.bold(rightBrack)}`)); }

function log_n(message, path) {
    console.log(chalk.white(`${leftBrack}#${rightBrack} ${date()} ${pipe} ${chalk.bold(message)}${path ? `${pipe} ${path}` : ''}`));
}

function log_w(warning, path) {
    console.log(chalk.yellow(`${leftBrack}*${rightBrack} ${date()} ${pipe} ${chalk.bold(warning)}${path ? `${pipe} ${path}` : ''}`));
}

function log_e(error, path) {
    console.log(chalk.red(`${leftBrack}!${rightBrack} ${date()} ${pipe} ${path ? `${leftBrack}${path}${rightBrack} ` : ''}${chalk.bold(error)}`));
}

function log_d(debug_message, path) {
    console.log(chalk.cyan(`${leftBrack}%${rightBrack} ${date()} ${pipe} ${chalk.bold(debug_message)}${path ? `${pipe} ${path}` : ''}`));
}

function log_c(command, user, guild, channel) {
    console.log(chalk.green(`${leftBrack}$${rightBrack} ${date()} ${pipe} ${chalk.bold(command)} ${pipe} ${user.username}#${user.discriminator} ${leftBrack}${user.id}${rightBrack} ${pipe} ${guild.name} ${leftBrack}${guild.id}${rightBrack} ${pipe} ${channel.name} ${leftBrack}${channel.id}${rightBrack}`));
}

module.exports = { log_n, log_e, log_w, log_d, log_c };