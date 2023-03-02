const handler = require('./lib/faye/handler');
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data/orgs.json', { encoding: 'utf8', flag: 'r' }));
for(let org of data.orgs){
    handler.subscribe(org);
}
