const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const contract = require("@truffle/contract");
const campaignJSON = require('../../final_project/build/contracts/Campaign.json')
const checkCampaignRegistration = require("./utils").checkCampaignRegistration;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);


async function withdraw(argv) {
  try {
    await checkCampaignRegistration(argv.campaign);
  } catch (e) {
    console.log(e);
    return;
  }
  let instance;
  try {
    instance = await CampaignContract.at(argv.campaign);
  } catch {
    console.log("Error while getting the contract from the network. Are you sure Ganache is running?");
    return;
  }
  try {
    await instance.withdraw({
      from: argv.from
    });
  } catch (e) {
    e.reason == undefined && console.log("Error while creating the campaign - " + e)
    e.reason != undefined && console.log("Error while creating the campaign - " + e.reason);
    return;
  }
  console.log("Successful withdraw by " + argv.from);
}

module.exports = withdraw;