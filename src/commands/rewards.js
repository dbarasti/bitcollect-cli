const inquirer = require('inquirer');
const Web3 = require('web3');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require(process.env.CAMPAIGN_CONTRACT);
const checkCampaignRegistration = require("../utils").checkCampaignRegistration;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

let questions = [{
    type: 'input',
    name: 'amounts',
    message: 'Which are the amounts donors must reach (in wei)?',
    validate: (value) => {
      let array = value.split(' ');
      return !array.some(isNaN) ? true : "Please enter a set of ordered rewards in the format x y x...";
    }
  },
  {
    type: 'input',
    name: 'rewards',
    message: 'Which are the rewards for each amount reached?'
  }
];

async function add(argv) {
  try {
    await checkCampaignRegistration(argv.campaign);
  } catch (e) {
    console.log(e);
    return;
  }
  inquirer.prompt(questions).then(async (answers) => {
    let instance;
    try {
      instance = await CampaignContract.at(argv.campaign);
    } catch {
      console.log("Error while getting the contract from the network. Are you sure Ganache is running / the contract address is correct?");
      return;
    }
    try {
      let amounts = answers.amounts.split(' ');
      let rewards = answers.rewards.split(' ');
      await instance.setRewards(amounts, rewards, {
        from: argv.from
      });
    } catch (e) {
      e.reason == undefined && console.log("Error while setting rewards for the campaign - " + e)
      e.reason != undefined && console.log("Error while setting rewards for the campaign - " + e.reason);
      return;
    }
    console.log("Successfully set rewards for " + argv.campaign);
  });
}

async function claim(argv) {
  try {
    await checkCampaignRegistration(argv.campaign);
  } catch (e) {
    console.log(e);
    return;
  }
  let instance;
  let rewards;
  try {
    instance = await CampaignContract.at(argv.campaign);
  } catch {
    console.log("Error while getting the contract from the network. Are you sure Ganache is running?");
    return;
  }
  try {
    rewards = await instance.claimRewards({
      from: argv.from
    });
  } catch (e) {
    e.reason == undefined && console.log("Error while requesting rewards - " + e)
    e.reason != undefined && console.log("Error while requesting rewards - " + e.reason);
    return;
  }
  console.log(`Rewards: ${rewards}`);
}

module.exports = {
  add,
  claim
}