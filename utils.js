
const { buildServiceActions }  = require('./service');
const shell = require('shelljs');
const chalk = require('chalk');

// shell dump
const say = (str) => shell.echo(chalk.cyan('Alfred:') + ` ${str}`);

const sayMore = (str, callback) => {
    say(str);
    if (callback) callback();
}

// debug
// function log() { console.debug(...arguments); }

const execServiceActions = ({ name, dryrun }) => {
    const serv = buildServiceActions(name);
    let exec = dryrun ? sayMore : shell.exec;

    if (serv.actions) {
        say(chalk.blueBright(`Service configuration found for ${name}`));

        serv.actions.forEach( (act) => {
            exec(act);    
        })

        // extra steps if any
        if ( serv.callback ) serv.callback();
    }
}


module.exports = { execServiceActions, say };
