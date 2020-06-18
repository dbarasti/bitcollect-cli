const inquirer = require('inquirer');
const chalk = require('chalk');
const toDate = require('normalize-date');
const timestamp = require('unix-timestamp');
const contractInterface = require('./contract-interaction');

let questions = [{
    type: 'input',
    name: 'organizers',
    message: 'Who are the organizers?',
    validate: validateAddress
  },
  {
    type: 'input',
    name: 'beneficiaries',
    message: 'Who are the beneficiaries?',
    validate: validateAddress
  },
  {
    type: 'input',
    name: 'deadline',
    message: 'When is the deadline scheduled? format dd/mm/yyyy or dd-mm-yyyy',
    validate: function (value) {
      var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; //match format dd/mm/yyyy or dd-mm-yyyy
      if (value.match(dateformat)) {
        return true;
      } else {
        return 'date should match the format dd/mm/yyyy or dd-mm-yyyy'
      }
    }
  }
];

function create(name, from) {
  inquirer.prompt(questions).then(answers => {
    console.log("answers.deadline: " + answers.deadline);
    console.log("toDate: " + toDate(answers.deadline));
    console.log("fromDate: " + timestamp.fromDate(toDate(answers.deadline)));

    let deadline = timestamp.fromDate(toDate(answers.deadline));
    let constructor = {
      from: from,
      organizers: answers.organizers.split(' '),
      beneficiaries: answers.beneficiaries.split(' '),
      deadline: deadline
    }
    contractInterface.newCampaign(constructor);
    console.log('\nCreating contract:');
    console.log(JSON.stringify(constructor, null, '  '));
  });
}

function validateAddress(value) {
  let addresses = value.split(' ');
  let pass = true;
  for (let i = 0; i < addresses.length && pass != undefined; i++) {
    pass = addresses[i].match(/^0x/);
  }
  if (pass) {
    return true;
  } else {
    return 'Please enter valid Ethereum addresses, separated by spaces';
  }
}

module.exports = create;