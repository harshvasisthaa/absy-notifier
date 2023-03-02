const jsforce = require("jsforce");
const config = require('./handler.json');

const refresh_access_token = (alias, callback) => {
    var conn = new jsforce.Connection({
        oauth2: {
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            redirectUri: config.redirectUri
        },
        instanceUrl: alias.instanceUrl,
        accessToken: alias.accessToken,
        refreshToken: alias.refreshToken
    });
    conn.oauth2.refreshToken(alias.refreshToken, (err, results) => {
        if (err){
            callback();
        }
        alias.accessToken = results.access_token;
        callback(alias)
    });
}

module.exports = {
    refreshToken: refresh_access_token
}