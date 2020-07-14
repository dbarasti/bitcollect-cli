const Web3 = require('web3');
require("dotenv/config");
const provider = new Web3.providers.HttpProvider(process.env.GANACHE);
const contract = require("@truffle/contract");
const campaignJSON = require(process.env.CAMPAIGN_CONTRACT);
const checkCampaignRegistration = require("../utils").checkCampaignRegistration;

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);


async function info(argv) {
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

  let info = {};

  try {
    info.organizers = await instance.getOrganizers({
      from: argv.from
    });
  } catch (e) {
    console.log("Error while getting organizers - " + (e.reason || e))
    return;
  }

  try {
    info.beneficiaries = await instance.getBeneficiaries({
      from: argv.from
    });
  } catch (e) {
    console.log("Error while getting beneficiaries - " + (e.reason || e))
    return;
  }

  try {
    let balBN = await instance.getBalance({
      from: argv.from
    });
    info.balance = balBN.toNumber();
  } catch (e) {
    console.log("Error while getting balance - " + (e.reason || e))
    return;
  }

  try {
    let deadlineTimestamp = await instance.deadline({
      from: argv.from
    });
    let date = new Date(deadlineTimestamp * 1000);
    info.timestmap = date.toISOString();
  } catch (e) {
    console.log("Error while getting deadline - " + (e.reason || e))
    return;
  }

  console.log(JSON.stringify(info, undefined, 2));
}

module.exports = info;