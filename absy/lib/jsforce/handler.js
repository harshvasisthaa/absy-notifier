const jsforce = require("jsforce");
const opn = require('opn');
const http = require('http');
const url = require('url');
const config = require('./handler.json');
const fs = require('fs');

const get_oAuth = (isSandbox, customURL) => {
    let properties = {};
    properties.loginUrl = "https://login.salesforce.com";
    if (isSandbox)
        properties.loginUrl = "https://test.salesforce.com";
    if (customURL)
        properties.loginUrl = customURL;

    properties.clientId = config.clientId;
    properties.clientSecret = config.clientSecret;
    properties.redirectUri = config.redirectUri;

    return new jsforce.OAuth2(properties);
}

const authenticate = (alias, isSandbox, customURL) => {
    let oAuth = get_oAuth(isSandbox, customURL)
    let server = http.createServer(function (req, res) {
        var url_parts = url.parse(req.url, true);
        if (url_parts.query.code) {
            get_access_token(url_parts.query.code, oAuth, server, alias, res)
        }
    }).listen(8080);;
    opn(oAuth.getAuthorizationUrl({ scope: 'api id web refresh_token' }))
}

const get_access_token = (code, oAuth, server, alias, res) => {
    let conn = new jsforce.Connection({ oauth2: oAuth });
    conn.authorize(code, function (err, userInfo) {
        if (err) {
            console.error(err);
            console.log('Unable to authenticate.')
        } else {
            save_data({
                accessToken: conn.accessToken,
                instanceUrl: conn.instanceUrl,
                userId: userInfo.id,
                orgId: userInfo.organizationId,
                refreshToken: conn.refreshToken,
                alias: alias
            })
            console.log('Successfully authenticated.')
        }
        res.end('<script>window.close();</script >');
        //console.log(srvr)
        // Close the server
        server.close(function () { process.exit(0) });
        setImmediate(function () { server.emit('close') });
    });
}

const save_data = (alias) => {
    let data = JSON.parse(fs.readFileSync('./data/orgs.json', { encoding: 'utf8', flag: 'r' }));
    data.orgs.push(alias);
    fs.writeFileSync('./data/orgs.json', JSON.stringify(data));
}

const delete_alias = (orgAlias, isLog) => {
    let data = JSON.parse(fs.readFileSync('./data/orgs.json', { encoding: 'utf8', flag: 'r' }));
    let aliasindex = -1;
    let aliasFound = false;
    for (let value of data.orgs) {
        aliasFound = (orgAlias === value.alias);
        aliasindex++;
        if (aliasFound)
            break;
    }
    if (aliasFound) {
        data.orgs.splice(aliasindex, 1);
        fs.writeFileSync('./data/orgs.json', JSON.stringify(data));
        if (isLog)
            log(chalk.green(`The alias '${orgAlias}' has been removed successfully.`))
        return;
    }
    if (isLog)
        log(error('The alias you have entered does not exists,\n'
            + 'Please enter the correct alias, use -l or --list to check all available alias.'));
}

module.exports = {
    authenticate: authenticate,
    deleteAlias: delete_alias
}