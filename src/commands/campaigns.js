var mongoose = require("mongoose");
require("dotenv/config");
require("../models/db");
const CampaignModel = require("../models/contracts").CampaignModel;

async function campaigns() {
  await CampaignModel.find({}, function (err, campaigns) {
    if (err) {
      console.log(err);
      return;
    }
    campaigns.forEach(campaign => {
      console.log(`address: ${campaign.address} \t creator: ${campaign.creator}`);
    });
  });
  mongoose.disconnect();
}


module.exports = campaigns;