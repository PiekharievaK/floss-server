const { Schema, model } = require("mongoose");

const flossSchema = Schema({
  number: {
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
});

const DMCFlosses = model("dmcfloss", flossSchema);

module.exports = {
  DMCFlosses,
};
