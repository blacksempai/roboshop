require('dotenv').config();
const doMigration = require('./src/db/migration');

doMigration().then(() => {
    require('./src/app');
    console.log(require('chalk').green('App has successfully started!'));
});
