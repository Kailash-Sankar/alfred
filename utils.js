
const { buildServiceActions }  = require('./service');
const shell = require('shelljs');
const chalk = require('chalk');

// shell dump
const say = (str) => shell.echo(chalk.cyan('Alfred:') + ` ${str}`);

const mockExec = () => {
    return { code : 0 };
}

// debug
// function log() { console.debug(...arguments); }

const execServiceActions = ({ name, dryrun }) => {
    const serv = buildServiceActions(name);
    let exec = dryrun ? mockExec : shell.exec;

    if (serv && serv.actions) {
        say(chalk.blueBright(`Service configuration found for ${name}`));

        for (act of serv.actions) {
            say(chalk.grey(`${act.cmd}`));
            if ( exec(act.cmd).code !== 0 ) {
                say(chalk.yellowBright(`${ act.req ? 'Essential' : 'Non-essential'} Step failed.`));
                if (act.req) {
                    say(chalk.yellowBright('Exiting...Please use dryrun to manually run and verify'));
                    return;
                }
                say(chalk.blueBright("there's still hope, proceeding to next step"));
            } 
        }

        // extra steps if any
        if ( serv.callback ) serv.callback();

        say(chalk.greenBright('Done...'));
    }
    else {
        say(chalk.yellowBright(`No configuration found for ${name}`));
    }
}


module.exports = { execServiceActions, say };
