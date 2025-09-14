const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true, maxlength: 400 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.models.Store || mongoose.model("Store", storeSchema);
