const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const contract = require("@truffle/contract");
const rewarderJSON = require('../../../final_project/build/contracts/CampaignRewarder.json')
let RewarderContract = contract(rewarderJSON);
RewarderContract.setProvider(provider);


async function create(constructor) {
  let instance;
  let addr;
  try {
    instance = await RewarderContract.new({
      from: constructor.from
    });
    addr = instance.address;
  } catch (e) {
    e.reason == undefined && console.log("Error while creating the campaign. Are you sure Ganache is running?")
    e.reason != undefined && console.log("Error while creating the campaign - " + e.reason);
    return;
  }
  console.log("Rewarder created successfully at " + addr);
}

async function fund(argv) {
  let instance;
  try {
    instance = await RewarderContract.at(argv.rewarder);
  } catch {
    console.log("Error while getting the contract from the network. Are you sure Ganache is running / the contract address is correct?");
    return;
  }
  try {
    await instance.send(argv.amount, {
      from: argv.from,
    });
  } catch (e) {
    e.reason == undefined && console.log("Error while funding the rewarder - " + e)
    e.reason != undefined && console.log("Error while funding the rewarder - " + e.reason);
    return;
  }
  console.log("Successfully fund the rewarder at " + argv.rewarder);
}

async function add(argv) {
  let instance;
  try {
    instance = await RewarderContract.at(argv.rewarder);
  } catch {
    console.log("Error while getting the contract from the network. Are you sure Ganache is running / the contract address is correct?");
    return;
  }

  try {
    await instance.addCampaign(argv.campaign, {
      from: argv.from,
    });
  } catch (e) {
    e.reason == undefined && console.log("Error while funding the rewarder - " + e)
    e.reason != undefined && console.log("Error while funding the rewarder - " + e.reason);
    return;
  }
  console.log("Successfully registered campaign at rewarder " + argv.rewarder);
}

module.exports = {
  create,
  fund,
  add
}