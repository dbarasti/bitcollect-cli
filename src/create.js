const inquirer = require('inquirer');
const toDate = require('normalize-date');
const timestamp = require('unix-timestamp');
var mongoose = require("mongoose");
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contract = require("@truffle/contract");
const campaignJSON = require('../../final_project/build/contracts/Campaign.json')
const models = require("./models/contracts");
require("./models/db");

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

async function newCampaign(constructor) {
  let instance = await CampaignContract.new(constructor.organizers, constructor.beneficiaries, constructor.deadline, {
    from: constructor.from
  })

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
    let addr = await newCampaign(constructor);
    console.log("Campaign created successfully at " + addr);
    return
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