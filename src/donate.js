var mongoose = require("mongoose");
const inquirer = require('inquirer');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const contract = require("@truffle/contract");
const campaignJSON = require('../../final_project/build/contracts/Campaign.json')
const CampaignModel = require("./models/contracts").CampaignModel;
require("./models/db");

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

let questions = [{
    type: 'input',
    name: 'amount',
    message: 'What\'s the amount (in wei) you want to donate?',
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

async function donate(argv) {
  // check that the campaign exists
  let exists = await CampaignModel.exists({
    address: argv.campaign
  })
  // no longer need the db connection
  mongoose.disconnect();
  if (!exists) {
    console.log("Error - campaign not registered at " + argv.campaign);
    return;
  }

  // collect other info
  inquirer.prompt(questions).then(async (answers) => {
    // donate to the campaign
    let instance;
    try {
      instance = await CampaignContract.at(argv.campaign);
    } catch {
      console.log("Error while getting the contract from the network. Are you sure Ganache is running?");
      return;
    }
    try {
      await instance.donate(answers.distribution.split(' '), {
        from: argv.from,
        value: answers.amount
      });
    } catch (e) {
      console.log("Error while donating to the campaign - " + e.reason);
      return;
    }
    console.log("Successful donation by " + argv.from);
    let balance = await instance.getBalance({
      from: argv.from
    })
    console.log("New campaign balance: " + balance);
    return; // why does it ducking hangs??
  });


}

module.exports = donate;