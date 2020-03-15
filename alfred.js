#!/usr/local/bin/node

const  { Command } = require('commander');
const { execServiceActions, say } = require('./utils');
const { servicesList } = require('./service');


const program = new Command();
program.version('0.0.1');

program
  .option('-d, --dryrun', 'prints the actions without executing')
  .option('-s, --serve <service>', 'updates a service');

program.on('--help', () => {
  console.log('');
  console.log('Currently supported services:');
  console.log(`${servicesList()}`);
});

program.parse(process.argv);

if ( program.serve ) {
  say('initializing...');
  console.log(program.opts());
  execServiceActions({ name: program.serve, dryrun: program.dryrun });
}

