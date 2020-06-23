#!/usr/bin/env node

const yargs = require('yargs');

yargs.version();
yargs.usage('Usage: $0 <command> [options]');
yargs.command({
  command: 'create',
  describe: 'Create and return the address of a new campaign',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    name: {
      describe: 'name of the campaign',
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/create')(argv.n, argv.f);
  }
});
yargs.command({
  command: 'initialize',
  aliases: 'init',
  describe: 'fund the campaign by sending an amount of ether',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign to fund',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/initialize')(argv);
  }
})

yargs.command({
  command: 'donate',
  describe: 'donate to the campaign',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign to donate to',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/donate')(argv);
  }
});

yargs.command({
  command: 'withdraw',
  describe: 'withdraw beneficiary\'s amount',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/withdraw')(argv);
  }
})

yargs.command({
  command: 'deactivate',
  describe: 'deactivate campaign',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign to deactivate',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/deactivate')(argv);
  }
})

yargs.command({
  command: 'set-milestones',
  describe: 'set milestones for the campaign',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign to which to add milestones',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/milestone')(argv);
  }
})




yargs.example("$0 create -f 0x123 -o 0x751 0x751 -b 0x421 0x112 0x985 -d '17-12-2020 15:02:00'",
  "create a new campaign specifying organizers, beneficiaries and the deadline");
// todo create examples
yargs.alias({
  'h': 'help',
  'f': 'from',
  'n': 'name',
  'o': 'organizers',
  'b': 'beneficiaries',
  'd': 'deadline',
  'a': 'amount',
  'c': 'campaign'
});
yargs.array(['o', 'b']);
yargs.demandCommand(1, 'You need at least one command before moving on');
yargs.help('h');
yargs.epilogue('for more information, find the GitHub page at https://github.com/dbarasti');
yargs.parse();