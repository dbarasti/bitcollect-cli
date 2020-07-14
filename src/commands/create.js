const inquirer = require('inquirer');
var mongoose = require("mongoose");
const Web3 = require('web3');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require(process.env.CAMPAIGN_CONTRACT);
const models = require("../models/contracts");
const validateAddresses = require("../utils").validateAddresses;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

let questions = [{
    type: 'input',
    name: 'organizers',
    message: 'Who are the organizers?',
    validate: validateAddresses
  },
  {
    type: 'input',
    name: 'beneficiaries',
    message: 'Who are the beneficiaries?',
    validate: validateAddresses
  },
  {
    type: 'input',
    name: 'deadline',
    message: 'When is the deadline scheduled?',
    validate: function (value) {
      if (Date.parse(value)) {
        return true;
      } else {
        return 'timeline should be a valid one'
      }
    }
  }
];


function create(name, from) {
  inquirer.prompt(questions).then(async (answers) => {
    let deadlineMillis = Date.parse(answers.deadline);
    let deadline = deadlineMillis / 1000;
    let constructor = {
      from: from,
      name: name,
      organizers: answers.organizers.split(' '),
      beneficiaries: answers.beneficiaries.split(' '),
      deadline: deadline
    }
    let addr;
    try {
      addr = await newCampaign(constructor);
    } catch (e) {
      e.reason == undefined && console.log("Error while creating the campaign. Are you sure Ganache is running?")
      e.reason != undefined && console.log("Error while creating the campaign - " + e.reason);
      return;
    }
    console.log("Campaign created successfully at " + addr);
  });
}

async function newCampaign(constructor) {
  let instance;

  instance = await CampaignContract.new(constructor.organizers, constructor.beneficiaries, constructor.deadline, {
    from: constructor.from
  });

  let campaign = new models.CampaignModel({
    creator: constructor.from,
    name: constructor.name,
    address: instance.address,
    createdAt: Date.now()
  });

  campaign.save((err) => {
    if (err) console.error(err);
    mongoose.disconnect();
  });
  return instance.address;
}

module.exports = create;