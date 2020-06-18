#!/usr/bin/env node

const argv = require('yargs')
  .version()
  .usage('Usage: $0 <command> [options]')
  .command('create', 'Create and return the address of a new campaign', {
    from: {
      alias: 'f',
      describe: 'account address that creates the campaign',
      demandOption: true,
      type: 'string'
    },
    organizers: {
      alias: 'o',
      describe: 'one or more addresses set as organizers of the campaign',
      demandOption: true,
      type: 'string'
    },
    beneficiaries: {
      alias: 'b',
      describe: 'addresses of the beneficiaries of the campaign',
      demandOption: true,
      type: 'string'
    },
    deadline: {
      alias: 'd',
      describe: 'campaign deadline in the ISO format YYYY-MM-DDTHH:MM:SSZ',
      demandOption: true,
      type: 'string'
    }
  }, (argv) => {
    console.log("contract created successfully. \n from: " + argv.from)
  })
  .example("$0 create vittime-covid -f 0x123 -o 0x751 0x751 -b 0x421 0x112 0x985 -d '17-12-2020 15:02:00'",
    "create a new campaign specifying organizers, beneficiaries and the deadline")
  .alias({
    'h': 'help',
    'f': 'from',
    'o': 'organizers',
    'b': 'beneficiaries',
    'd': 'deadline',
    'a': 'amount',
    'c': 'campaign'
  })
  .array(['o', 'b'])
  .demandCommand(1, 'You need at least one command before moving on')
  .help('h')
  .epilogue('for more information, find the GitHub page at https://github.com/dbarasti')
  .argv