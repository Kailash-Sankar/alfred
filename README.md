# alfred

- Barebone tool for updating sandbox servers
- Runs a set of commands to update local docker services based on config
- create a config.js file using the sample provided in config.example.js

## Notes

- all the commands are echoed before execution
- steps can be optional, specify in config
- messages are color coded

## usage

     // help
     alfred -h 

     // dry run first
     alfred --serve <app_name> --dryrun

     // execute
     alfred --serve <app_name>

