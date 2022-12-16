const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userCollectionSchema = Schema(
  {
    email: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require,
    },
    flossCollection: [
      {
        number: {
          type: String,
          required: [true, "Set namber for floss"],
        },
        label: {
          type: String,
          required: [true, "Set label for floss"],
        },
        hex: {
          type: String,
          required: [true, "Select color for floss"],
        },
        colorName: {
          type: String,
          required: [true, "Set color name for floss"],
        },
        colorRUname: {
          type: String,
          default: "No RU name",
        },

        count: {
          type: Number,
          default: false,
          required: [true, "Set count for floss"],
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

const addDMCValidate = Joi.object({
  floss: {
    number: Joi.string().min(3).max(30).required().messages({
      "string.empty": `Floss number cannot be an empty field`,
      "string.min": `Floss number should have a minimum length of {#limit}`,
      "any.required": `Floss number is a required field`,
    }),
    label: Joi.string().required(),
    count: Joi.number().required().messages({
      "any.required": `Floss count cannot be an empty field, it's required`,
    }),
  },
  collectionId: Joi.string().required(),
});

const addOtherValidate = Joi.object({
  floss: {
    label: Joi.any().required().messages({
      "string.empty": `Floss label cannot be an empty field`,
      "string.invalid": `Floss label can't be "DMC", it have reserved number you can add in like "DMC" just in that field. Else you can add it like "Dmc" "dmc" if our collection haven't this number`,
      "any.required": `Floss label is a required field`,
    }),
    colorName: Joi.string().required(),
    hex: Joi.string().required().messages({
      "any.required": `Please choose the color of your floss`,
    }),
    number: Joi.string().max(30).required().messages({
      "any.required": `Floss number cannot be an empty field, it's required`,
    }),
    count: Joi.number().required().messages({
      "any.required": `Floss count cannot be an empty field, it's required`,
    }),
  },
  collectionId: Joi.string().required(),
});

const updateValidate = Joi.object({
  count: Joi.number().required(),
  flossId: Joi.string().required(),
  method: Joi.string().required(),
});

const updateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const UserCollection = model("usersfloss", userCollectionSchema);

module.exports = {
  flossValidate,
  addDMCValidate,
  addOtherValidate,
  updateValidate,
  updateFavorite,
  UserCollection,
};
