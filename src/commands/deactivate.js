const Web3 = require('web3');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require(process.env.CAMPAIGN_CONTRACT);
const checkCampaignRegistration = require("../utils").checkCampaignRegistration;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

async function deactivate(argv) {
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
    await instance.deactivate({
      from: argv.from
    });
  } catch (e) {
    e.reason == undefined && console.log("Error while deactivating the campaign - " + e)
    e.reason != undefined && console.log("Error while deactivating the campaign - " + e.reason);
    return;
  }
  console.log("Successful deactivated campaign " + argv.campaign);
}

module.exports = deactivate;