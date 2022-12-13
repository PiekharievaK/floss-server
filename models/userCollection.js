const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userCollectionSchema = Schema(
  {
    email: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
     require
    },
    flossCollection: [
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
          default: "unknown",
        },
        label: {
          type: String,
          require,
        },

        count: {
          type: Number,
          require,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const flossValidate = Joi.object({
  dmcNumber: Joi.string().min(3).max(30).required(),
  hex: Joi.string().required(),
  colorName: Joi.string(),
  count: Joi.number(),
});

const addValidate = Joi.object({
  collectionId: Joi.string(),
  floss: {
    number: Joi.string().min(1).max(30).required(),
    label: Joi.string(),
    colorName: Joi.string(),
    hex: Joi.string(),
    name: Joi.string(),
    count: Joi.number().required(),
  },
});

const updateValidate = Joi.object({
  name: Joi.string().min(3).max(30),
  id: Joi.string(),
  count: Joi.number(),
});

const updateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const UserCollection = model("usersfloss", userCollectionSchema);

module.exports = {
  flossValidate,
  addValidate,
  updateValidate,
  updateFavorite,
  UserCollection,
};
