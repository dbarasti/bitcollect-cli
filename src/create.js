const inquirer = require('inquirer');
const toDate = require('normalize-date');
const timestamp = require('unix-timestamp');
var mongoose = require("mongoose");
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
const contract = require("@truffle/contract");
const campaignJSON = require('../../final_project/build/contracts/Campaign.json')
const models = require("./models/contracts");
const validateAddresses = require("./utils").validateAddresses;

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
    message: 'When is the deadline scheduled? format yyyy/mm/dd or yyyy-mm-dd',
    validate: function (value) {
      var dateformat = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
      if (value.match(dateformat)) {
        return true;
      } else {
        return 'date should match the format yyyy/mm/dd or yyyy-mm-dd'
      }
    }
  }
];


function create(name, from) {
  inquirer.prompt(questions).then(async (answers) => {
    let deadline = timestamp.fromDate(toDate(answers.deadline));
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
      e.reason == undefined && console.log("Error while creating the contract. Are you sure Ganache is running?")
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