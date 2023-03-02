const notifier = require('node-notifier');
const path = require('path');
const open = require('../open');

const push_notificaion = (title, msg, wait = true, targetURL) => {
	let options = {
		title: title,
		message: msg,
		icon: path.join('./absy.jpg'),
		wait: wait,
		appID: "absy"
	}
	if (targetURL) {
		options.actions = ['Open', 'Cancel'];
	} else {
		options.actions = ['Cancel'];
	}
	notifier.notify(options, (err, data) => {
		// Will also wait until notification is closed.
		//console.log('Waited');
		//console.log('Waited' + err);
		//console.log('Waited' + data);
		//console.log(JSON.stringify({ err, data }, null, '\t'));
		if (data) {
			if ((data == 'activate' || data == 'open') && targetURL) {
				open.openURL(targetURL);
			}
		}
	}
	);

	// Built-in actions:
	notifier.on('timeout', () => {
		//console.log('Timed out!');
	});
	notifier.on('dismissed', () => {
		//console.log('Dismissed!');
	});
	notifier.on('cancel', () => {
		//console.log('"Cancel" was pressed');
	});
}

module.exports = {
	notify: push_notificaion
}