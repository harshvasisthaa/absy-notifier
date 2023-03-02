const chalk = require("chalk");
const fs = require('fs');

const sforceHandler = require('./jsforce/handler');

const LOG_DIR = './data/logs/'

const error = chalk.bold.red;
const log = console.log;

const list_orgs = () => {
    console.log('listing orgs');
    let data = JSON.parse(fs.readFileSync('./data/orgs.json', { encoding: 'utf8', flag: 'r' }));
    for (let value of data.orgs) {
        log(chalk.yellow('Alias: '), chalk.green(value.alias));
        log(chalk.yellow('URL: '), chalk.green(value.instanceUrl));
        log(chalk.yellow('Subscribed: '), chalk.green(value.isSubscribed ? true : false));
        log();
    }
}

const list_notifications = (alias) => {
    console.log('listing notificaions');
    const dirents = fs.readdirSync(LOG_DIR, { withFileTypes: true });
    let data;
    for (let orgs of dirents) {
        log(chalk.yellow('Org Id: '), chalk.green(orgs.name));
        let files = fs.readdirSync(LOG_DIR + orgs.name, { withFileTypes: true });
        for (let notificaion of files) {
            data = JSON.parse(fs.readFileSync(LOG_DIR + orgs.name + '/' + notificaion.name, { encoding: 'utf8', flag: 'r' }));
            if (alias === '' || data.alias === alias)
                log(data)
        }
    }
}

const auth_org = (orgAlias, isSandbox, customURL) => {
    if (validate_alias(orgAlias)) {
        log(error('The alias you have entered already exists, Please use different alias name.'));
        return;
    }
    sforceHandler.authenticate(orgAlias, isSandbox, customURL);
}

const validate_alias = (orgAlias) => {
    let data = JSON.parse(fs.readFileSync('./data/orgs.json', { encoding: 'utf8', flag: 'r' }));
    let aliasFound = undefined;
    for (let value of data.orgs) {
        aliasFound = (orgAlias === value.alias) ? value : undefined;
        if (aliasFound)
            break;
    }
    return aliasFound;
}

const subscribe = (orgAlias) => {
    let alias = validate_alias(orgAlias);
    if (alias) {
        //sforceHandler.refreshAccessToken(alias);
    }
}

module.exports = {
    listOrgs: list_orgs,
    authOrg: auth_org,
    deleteOrg: sforceHandler.deleteAlias,
    listNotifications: list_notifications
}