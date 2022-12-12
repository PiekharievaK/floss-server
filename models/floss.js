const { Schema, model } = require("mongoose");
// const Joi = require("joi");

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

    // count: {
    //   type: Number,
    //   default: false,
    // },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
  }
//   ,
//   { versionKey: false, timestamps: true }
);

// const addValidate = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   email: Joi.string().required(),
//   phone: Joi.number().required(),
//   favorite: Joi.bool(),
// });

// const updateValidate = Joi.object({
//   name: Joi.string().min(3).max(30),
//   email: Joi.string(),
//   phone: Joi.number(),
//   favorite: Joi.bool(),
// });

// const updateFavorite = Joi.object({
//   favorite: Joi.bool().required(),
// });

const DMCFlosses = model("dmcfloss", flossSchema);

module.exports = {
//   addValidate,
//   updateValidate,
//   updateFavorite,
DMCFlosses,
};
