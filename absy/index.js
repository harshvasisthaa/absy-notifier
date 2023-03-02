#!/usr/bin/env node

/**
 * absy
 * Absy app allow salesforce to send push notification to desktop (Windows, MacOS, Linux).
 *
 * @author Harsh Rawat <https://www.linkedin.com/in/harsh-rawat/>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const helper = require('./lib/helper');
const open = require('./lib/open');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	input.includes(`subscribe`) && open.subscribe();
	input.includes(`unsubscribe`) && open.unsubscribe();

	if(flags.list){
		helper.listOrgs();
	}

	if(flags.auth){
		helper.authOrg(flags.auth, flags.sandbox, flags.custom);
	}

	if(flags.delete){
		helper.deleteOrg(flags.delete, true);
	}

	if(flags.notificaions != undefined){
		helper.listNotifications(flags.notificaions);
	}

	debug && log(flags);
})();
