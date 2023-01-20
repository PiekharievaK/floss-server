const { Schema, model } = require("mongoose");

const flossSchema = Schema({
  dmcNumber: {
    type: String,
    required: [true, "Set name for contact"],
  },
  hex: {
    type: String,
  },
  colorName: {
    type: String,
  },
  colorRUname: {
    type: String,
  },
  labels: {
   
DMC: {
    type: String,
  },
BELKA: {
    type: String,
  },
Kirova: {
    type: String,
  },
Bestex: {
    type: String,
  },
Gamma: {
    type: String,
  },
Anchor: {
    type: String,
  },
Madeira: {
    type: String,
  },
  }
});

// const DMCFlosses = model("dmcfloss", flossSchema);
const DataFlosses = model("flossesdata", flossSchema);

module.exports = {
  DataFlosses,
};
