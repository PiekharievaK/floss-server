const { Schema, model } = require("mongoose");
const Joi = require("joi");

const flossSchema = Schema(
  
  {
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

    count: {
      type: Number,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  }
//   ,
//   { versionKey: false, timestamps: true }
);

const addValidate = Joi.object({
  dmcNumber: Joi.string().min(3).max(30).required(),
  hex: Joi.string().required(),
  colorName: Joi.string(),
  count: Joi.number(),
 });

const updateValidate = Joi.object({
  name: Joi.string().min(3).max(30),
  id: Joi.string(),
  count: Joi.number(),

});

const deleteFavorite = Joi.object({
  id: Joi.string().required(),
});

const Floss = model("floss", flossSchema);

module.exports = {
  addValidate,
  updateValidate,
  deleteFavorite,
  Floss,
};
