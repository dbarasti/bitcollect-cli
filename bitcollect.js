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
    require('./src/commands/create')(argv.n, argv.f);
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
    require('./src/commands/initialize')(argv);
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
    require('./src/commands/donate')(argv);
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
    require('./src/commands/withdraw')(argv);
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
    require('./src/commands/deactivate')(argv);
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
    require('./src/commands/milestone')(argv);
  }
})

yargs.command('reward', 'manage donors\' rewards of a campaign', function (yargs) {
  argv = yargs
    .usage('usage: $0 reward <action> [options]')
    .command('add', 'add a new series of rewards', function (yargs) {
      yargs.option('from', {
        demandOption: true,
        describe: 'account setting the rewards'
      });
      yargs.option('campaign', {
        demandOption: true,
        describe: 'address of the campaign'
      });
    }, (yargs) => {
      require('./src/commands/rewards').add(yargs);
    })
    .command('claim', 'claim your rewards, if any present', function (yargs) {
        yargs.option('from', {
          demandOption: true,
          describe: 'account requesting the rewards'
        });
        yargs.option('campaign', {
          demandOption: true,
          describe: 'address of the campaign'
        });
      },
      function (yargs) {
        require('./src/commands/rewards').claim(yargs);
      })
    .help('help')
    .updateStrings({
      'Commands:': 'action:'
    })
    .wrap(null)
    .argv
  checkCommands(yargs, argv, 2)
})


yargs.command('rewarder', 'manage milestone rewarder', function (yargs) {
  argv = yargs
    .usage('usage: $0 rewarder <action> [options]')
    .command('create', 'deploy a new rewarder', function (yargs) {
      yargs.option('from', {
        demandOption: true,
        describe: 'account creating the rewarder contract'
      });
    }, (yargs) => {
      require('./src/commands/rewarder').create(yargs);
    })
    .command('fund', 'send an amount to a rewarder', function (yargs) {
        yargs.option('from', {
          demandOption: true,
          describe: 'account sending ether to the rewarder contract'
        });
        yargs.option('rewarder', {
          demandOption: true,
          describe: 'address of the rewarder'
        });
        yargs.option('amount', {
          demandOption: true,
          describe: 'amount to send to the rewarder contract'
        });
      },
      function (yargs) {
        require('./src/commands/rewarder').fund(yargs);
      })
    .command('add', 'register existing campaign to rewarder', function (yargs) {
      yargs.option('f', {
        demandOption: true,
        describe: 'account sending ether to the rewarder contract'
      });
      yargs.option('r', {
        demandOption: true,
        describe: 'address of the rewarder'
      });
      yargs.option('c', {
        demandOption: true,
        describe: 'campaign address that you want to register to the rewarder'
      });
    }, function (yargs) {
      require('./src/commands/rewarder').add(yargs);
    })
    .help('help')
    .updateStrings({
      'Commands:': 'action:'
    })
    .wrap(null)
    .argv
  checkCommands(yargs, argv, 2)
})

yargs.command({
  command: 'campaigns',
  describe: 'retrieve the addresses of the registered campaigns',
  handler: (argv) => {
    require('./src/commands/campaigns')();
  }
})

yargs.command({
  command: 'info',
  describe: 'get information about a campaign',
  builder: {
    from: {
      describe: 'account address issuing the command',
      demandOption: true,
      type: 'string'
    },
    campaign: {
      describe: 'address of the campaign you want to know of',
      demandOption: true,
      type: 'string'
    }
  },
  handler: (argv) => {
    require('./src/commands/info')(argv);
  }
})

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired) {
    yargs.showHelp()
  } else {
    // check for unknown command
  }
}

yargs.example("$0 create -f 0x123",
  "create a new campaign specifying the creator");
// todo create examples

yargs.alias({
  'h': 'help',
  'f': 'from',
  'n': 'name',
  'o': 'organizers',
  'b': 'beneficiaries',
  'd': 'deadline',
  'a': 'amount',
  'r': 'rewarder',
  'c': 'campaign'
});
yargs.array(['o', 'b']);
yargs.demandCommand(1, 'You need at least one command before moving on');
yargs.help('h');
yargs.epilogue('for more information, find the GitHub page at https://github.com/dbarasti/bitcollect-cli');
// equivalent to calling yargs.argv
yargs.parse();