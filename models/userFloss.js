const { Schema, model } = require("mongoose");
const Joi = require("joi");

const flossSchema = Schema(
  {
    number: {
      type: String,
      required: [true, "Set namber for floss"],
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
      require,
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

const Floss = model("usersfloss", flossSchema);

module.exports = {
  addValidate,
  updateValidate,
  deleteFavorite,
  Floss,
};
