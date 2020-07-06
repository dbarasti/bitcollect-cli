const inquirer = require('inquirer');
const Web3 = require('web3');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require('../../../final_project/build/contracts/Campaign.json')
const checkCampaignRegistration = require("../utils").checkCampaignRegistration;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

let questions = [{
    type: 'input',
    name: 'amount',
    message: 'What\'s the amount (in wei) you want to initialize with?',
    validate: (value) => {
      return !isNaN(value) ? true : "Please enter an integer";
    }
  },
  {
    type: 'input',
    name: 'distribution',
    message: 'How you want to distribute the amount?',
    validate: (value) => {
      let array = value.split(' ');
      return !array.some(isNaN) ? true : "Please enter a distribution in the format x y x...";
    }
  }
];

async function initialize(argv) {
  try {
    await checkCampaignRegistration(argv.campaign);
  } catch (e) {
    console.log(e);
    return;
  }

  // collect other info
  inquirer.prompt(questions).then(async (answers) => {
    // fund the campaign
    try {
      let instance = await CampaignContract.at(argv.campaign);
      await instance.initialize(answers.distribution.split(' '), {
        from: argv.from,
        value: answers.amount
      });
    } catch (e) {
      console.log("Error while initializing the campaign - " + e.reason);

      return;
    }
    console.log("Campaign initialized by " + argv.from);
    return;
  });


}

module.exports = initialize;