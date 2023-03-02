const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `cl`,
		desc: `Clear the console`
	},
	/*noClear: {
		type: `boolean`,
		default: true,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},*/
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	auth: {
		type: `string`,
		alias: `a`,
		desc: `Authenticate a Salesforce org using SFDX, this requires the alias i.e. '-a alias' or '--auth alias'`
	},
	sandbox: {
		type: `boolean`,
		alias: `s`,
		desc: `This command will allow to authenticate with Salesforce sandbox,`+
				`this has to be utilized with auth param i.e. '-a alias -s' or '--auth alias --sandbox'`
	},
	custom: {
		type: `string`,
		alias: `c`,
		desc: `This command will allow to authenticate with Salesforce custom URL org,`+
				`this has to be utilized with auth param i.e. '-a alias -c https://custom.salesforce.com' or '--auth alias --custom https://custom.salesforce.com'`
	},
	list: {
		type: `boolean`,
		alias: `l`,
		desc: `List all the authenticated Salesforce orgs`
	},
	notificaions: {
		type: `string`,
		alias: `n`,
		desc: `List all the notificaion received from all authenticated Salesforce orgs, if need specific use "-n alias"`
	},
	delete: {
		type: `string`,
		alias: `d`,
		desc: `Delete the alias name '-d alias' or '--delete alias'`
	}
};

const commands = {
	help: { desc: `Print help info` },
	subscribe: {desc: `Subscribe to all authenticated orgs.`},
	unsubscribe: {desc: `Un-Subscribe to all authenticated orgs.`}
};

const helpText = meowHelp({
	name: `absy`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
