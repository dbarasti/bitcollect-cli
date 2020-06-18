const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contract = require("@truffle/contract");
const campaignJSON = require('../../final_project/build/contracts/Campaign.json')


const web3 = new Web3('ws://localhost:8546');

let CampaignContract = contract(campaignJSON);
CampaignContract.setProvider(provider);

async function newCampaign() {
  let instance = await CampaignContract.at('0xce2455291b60E1cadB8be448A89B8f6EB866bFFB');
  let status = await instance.getStatus({
    from: '0xdB4a1f5FFfE0b5B17F430E238870CbB8fcFCb038',
  });
  console.log(status);
}




module.exports = {
  newCampaign: newCampaign
}