const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  creator: String,
  name: String,
  address: String,
  createdAt: Number
})

var CampaignModel = mongoose.model("Campaign", campaignSchema);

module.exports = {
  CampaignModel
}