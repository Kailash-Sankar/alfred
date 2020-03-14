
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
    const actions = buildServiceActions(name);
    let exec = dryrun ? sayMore : shell.exec;

    if (actions) {
        say(chalk.blueBright(`Service configuration found for ${name}`));
        //log('actions', actions);
        
        exec(actions.pull, () => {
            exec(actions.rmImg);
            exec(actions.tag);
            
            // stop and start container
            exec(actions.stop);
            exec(actions.rmContainer);
            exec(actions.start);

            // extra steps if any
            if ( actions.extra.length ) {
                actions.extra.forEach( cmd => {
                    exec(cmd);
                });
            }
        });
    }
}


module.exports = { execServiceActions, say };
