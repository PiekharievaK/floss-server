const { DMCFlosses } = require("../models/floss");

const getFlossCollection = async (req, res, next) => {
  try {
    const collection = await DMCFlosses.find({});

    res.status(200).json(collection);
  } catch (e) {
    res.status(204).json({ message: "No contacts" });
    next(e);
  }
};

module.exports = {
  getFlossCollection,
};
