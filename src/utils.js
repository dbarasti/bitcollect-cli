require("./models/db");
var mongoose = require("mongoose");
const CampaignModel = require("./models/contracts").CampaignModel;



async function checkCampaignRegistration(address) {
  let exists = await CampaignModel.exists({
    address: address
  })
  mongoose.disconnect();
  if (!exists) {
    throw `Error - campaign not registered at ${address}`;
  }
}

function validateAddresses(value) {
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

function validateAddress(value) {
  pass = value.match(/^0x/);
  return pass ? true : 'Please enter a valid Ethereum address';
}

module.exports = {
  checkCampaignRegistration,
  validateAddresses,
  validateAddress
}