const { Schema, model } = require("mongoose");
const Joi = require("joi");

const dmcUserFlosesSchema = Schema(
  {
    name: {type:String},

    owner: {type: Schema.Types.ObjectId},

    flosses: {type:String},
  },
  { versionKey: false, timestamps: true }
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

const updateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const UserCollection = model("usersfloss", dmcUserFlosesSchema);

module.exports = {
  addValidate,
  updateValidate,
  updateFavorite,
  UserCollection,
};
