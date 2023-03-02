const faye = require('faye');
const crypto = require('crypto');
const notifier = require('../notifier/handler');
const sforceHandler = require('../jsforce/handler');
const fs = require('fs');

const LOG_DIR = './data/logs/'

const subscribe = (alias) => {
    var client = new faye.Client(`${alias.instanceUrl}/cometd/40.0/`);
    client.setHeader('Authorization', `OAuth ${alias.accessToken}`);
    client.subscribe('/event/Notifier__e', function (message) {
        //console.log(message);
        let title = message.payload.Title__c ? message.payload.Title__c : `Notificaion from alias ${alias.alias}`;
        let target = message.payload.Target_Id__c ? alias.instanceUrl + '/' + message.payload.Target_Id__c : undefined;
        let sendNotification = true;
        log_notificaions(alias, message)
        if (message.payload.Users__c) {
            sendNotification = message.payload.Users__c.split(',').includes(alias.userId);
        }
        if (sendNotification)
            notifier.notify(title, message.payload.Content__c, true, target);
    });
    client.bind('transport:down', function () {
        //console.log(true, client);
    });

    client.bind('transport:up', function () {
        if (client._state == 1) {
            //console.log('Subscription Failed, re-authenticating.');
            //
            sforceHandler.refreshToken(alias, (response) => {
                client.disconnect();
                if (response) {
                    subscribe(response);
                } else {
                    response.isRefreshFailed = true;
                    notifier.notify('Subscription Error', `Unable to subscribe for alias ${alias.alias}. Please re-authenticate.`, false);
                }
            });
        }
        if (client._state == 3 && !alias.isFirstEnable) {
            notifier.notify('Subscription Enabled', `Notificaion has been enabled for alias ${alias.alias}.`, false);
            alias.isFirstEnable = true;
        }
    });
    return client;
}

const log_notificaions = (alias, notificaion) => {
    let location = LOG_DIR + alias.orgId;
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
    }
    notificaion.alias = alias.alias;
    location += `/${notificaion.event.replayId}.json`;
    fs.writeFileSync(location, JSON.stringify(notificaion));
}

module.exports = {
    subscribe: subscribe
}

