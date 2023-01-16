const {
  UserCollection,
  addDMCValidate,
  addOtherValidate,
  updateValidate,
  updateFavorite,
} = require("../models/userCollection");
const { DMCFlosses } = require("../models/floss");

const getAll = async (req, res, next) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await UserCollection.findById(collectionId);

    res.status(200).json(collection.flossCollection);
  } catch (e) {
    res.status(204).json({ message: "No flosses" });
    next(e);
  }
};

const getFlossById = async (req, res, next) => {
  const collection = await UserCollection.findById(req.params.flossId);
  try {
    if (!collection) {
      throw new Error();
    }
    if (req.body.floss.label === "DMC") {
      const dmc = await DMCFlosses.find({ number: req.body.floss.number });
      console.log(dmc);
    }
    res.status(200).json(collection);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const addNewFloss = async (req, res, next) => {
  const { collectionId, floss } = req.body;

  const userCollection = await UserCollection.findById(collectionId);

  try {
    if (floss.label === "DMC") {
      const { error } = addDMCValidate.validate(req.body);
      if (error) {
        console.log(error);
        console.log(error.details[0].message);
        throw new Error(`${error.details[0].message}`);
      }
    }
    if (floss.label !== "DMC") {
      const { error } = addOtherValidate.validate(req.body);
      console.log(error);
      if (error) {
        throw new Error(`${error.details[0].message}`);
      }
    }

    if (
      userCollection.flossCollection.find(
        (item) => item.number === floss.number && item.label.toLowerCase() === floss.label.toLowerCase()
      )
    ) {
      throw new Error(
        "You already have this floss. Please find it in your collection and update count"
      );
    }

    if (floss.label === "DMC") {
      const dmc = await DMCFlosses.findOne({ number: floss.number });
      if (!dmc) {
        throw new Error(
          "no this floss on our collection, pleade add it like `Other`, uou can use 'Dmc' label"
        );
      }
      const newFloss = {
        label: floss.label,
        number: dmc.number,
        hex: dmc.hex,
        colorName: dmc.colorName,
        colorRUname: dmc.colorRUname,
        count: floss.count,
      };
      await UserCollection.findByIdAndUpdate(collectionId, {
        flossCollection: [...userCollection.flossCollection, newFloss],
      });
      res.status(201).json(dmc);
    } else {
      console.log(floss);
      const cl = await UserCollection.findByIdAndUpdate(collectionId, {
        flossCollection: [...userCollection.flossCollection, floss],
      });

      if (!userCollection) {
        throw new Error("no collection");
      }

      res.status(201).json(cl);
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
    next(e);
  }
};

const deleteFloss = async (req, res, next) => {
  try {
    const floss = await UserCollection.findByIdAndUpdate(req.params.flossId);
    if (!floss) {
      throw new Error();
    }
    res.status(200).json({ message: "floss deleted" });
  } catch {
    res.status(404).json({ message: "Not found" });
    next();
  }
};

const updateFloss = async (req, res, next) => {
  const { flossId, method } = req.body;
  const userCollection = await UserCollection.findById(req.params.collectionId);

  try {
    if (method === "delete") {
      console.log("delete");

      const newCollection = userCollection.flossCollection.filter(
        (item) => item._id.toString() !== flossId
      );
      const floss = await UserCollection.findByIdAndUpdate(
        req.params.collectionId,
        { flossCollection: newCollection }
      );
      res.status(200).json(`floss ${floss} delete`);
    } else {
      const { error } = updateValidate.validate(req.body);
      if (error) {
        throw new Error(`${error.details[0].message}`);
      }


      const newCollection = userCollection.flossCollection.map((item) => {
        if (item._id.toString() === flossId) {
          item.count = req.body.count;
          return item;
        }
        return item;
      });
      const floss = await UserCollection.findByIdAndUpdate(
        req.params.collectionId,
        { flossCollection: newCollection }
      );

      res.json(floss);
    }
  } catch (e) {
    res.status(404).json({ message: e.message });
    next(e);
  }
};

const updateStatusFloss = async (req, res, next) => {
  const { error } = updateFavorite.validate(req.body);
  try {
    if (error) {
      const message = error ? error.message : "missing field";
      res.status(400).json(message);
      return;
    }
    const floss = await UserCollection.findByIdAndUpdate(
      req.params.flossId,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (floss === null) {
      throw new Error("Not found");
    }
    res.json(floss);
  } catch (e) {
    res.status(404).json({ message: e.message });
    next(e);
  }
};

module.exports = {
  getAll,
  getFlossById,
  addNewFloss,
  deleteFloss,
  updateFloss,
  updateStatusFloss,
};
