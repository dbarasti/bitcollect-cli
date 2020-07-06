const Web3 = require('web3');
const inquirer = require('inquirer');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require('../../../final_project/build/contracts/Campaign.json')
const Utils = require("../utils");

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

let questions = [{
    type: 'input',
    name: 'rewards',
    message: 'Which are the amounts (in wei) for each milestone?',
    validate: (value) => {
      let array = value.split(' ');
      return !array.some(isNaN) ? true : "Please enter a set of ordered milestones in the format x y x...";
    }

  },
  {
    type: 'input',
    name: 'rewarder',
    message: 'Which is the address of the rewarder?',
    validate: Utils.validateAddress
  }
];

async function milestone(argv) {
  try {
    await Utils.checkCampaignRegistration(argv.campaign);
  } catch (e) {
    console.log(e);
    return;
  }
  inquirer.prompt(questions).then(async (answers) => {
    let instance;
    try {
      instance = await CampaignContract.at(argv.campaign);
    } catch {
      console.log("Error while getting the contract from the network. Are you sure Ganache is running?");
      return;
    }
    try {
      let rewards = answers.rewards.split(' ');
      await instance.setMilestones(rewards, answers.rewarder, {
        from: argv.from
      });
    } catch (e) {
      e.reason == undefined && console.log("Error while setting milestones for the campaign - " + e)
      e.reason != undefined && console.log("Error while setting milestones for the campaign - " + e.reason);
      return;
    }
    console.log("Successfully set milestones for " + argv.campaign);
  });


}

module.exports = milestone;