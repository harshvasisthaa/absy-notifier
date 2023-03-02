const { platform } = require('os');
const { exec } = require('child_process');

module.exports = {
    subscribe: () => {
        const osPlatform = platform();
        let command;
        if (osPlatform === 'win32') {
            command = `absy-start.vbs`;
        } else if (osPlatform === 'darwin') {
            command = `./absy.sh`;
        } else {
            command = `./absy-notifier-linux`;
        }
        console.log('Subscribing to all the orgs.')
        exec(command);
    },
    unsubscribe: () => {
        const osPlatform = platform();
        let command;
        if (osPlatform === 'win32') {
            command = `absy-stop.bat`;
        } else if (osPlatform === 'darwin') {
            command = `./absy.sh`;
        } else {
            command = `./absy-notifier-linux`;
        }
        console.log('Un-Subscribling to all the orgs notificaions.')
        exec(command);
    }
}