const { platform } = require('os');
const { exec } = require('child_process');

const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';


module.exports = {
    openURL: (url) => {
        if (url === undefined) {
            return;
        }
        const osPlatform = platform();
        let command;
        if (osPlatform === 'win32') {
            command = `start ${url}`;
        } else if (osPlatform === 'darwin') {
            command = `open -a ${url}`;
        } else {
            command = `google-chrome --no-sandbox ${url}`;
        }
        exec(command);
    }
}