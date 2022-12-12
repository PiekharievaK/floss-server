const {
    UserCollection,
    addValidate,
    updateValidate,
    updateFavorite,
  } = require("../models/userCollection");
  
  const getAll = async (req, res, next) => {
    const id = req.body.user._id
    try {
      const flosses = await UserCollection.findOne({owner: id}).populate("owner", "_id, email" );
      console.log(flosses);
      
      res.status(200).json(flosses);
    } catch (e) {
      res.status(204).json({ message: "No flosses" });
      next(e);
    }
  };
  
  const getFlossById = async (req, res, next) => {
    try {
      const flosses = await UserCollection.findById(req.params.flossId);
      if (!flosses) {
        throw new Error();
      }
      res.status(200).json(flosses);
    } catch (e) {
      res.status(404).json({ message: "Not found" });
      next(e);
    }
  };
  
  const addNewFloss = async (req, res, next) => {
    const { error } = addValidate.validate(req.body);
  
    try {
      if (error) {
        throw new Error(error.message);
      }
      const {_id} = req.user;
      const floss = await UserCollection.create({...req.body, owner: _id} );
      if (!floss) {
        throw new Error("Floss with this nunber has already been in your journal");
      }
   
      res.status(201).json({ floss: floss });
    } catch (e) {
      res.status(400).json({ message: e.message });
      next(e);
    }
  };
  
  const deleteFloss = async (req, res, next) => {
    try {
      const floss = await UserCollection.findByIdAndDelete(req.params.flossId);
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
    const { error, value } = updateValidate.validate(req.body);
    try {
      if (error || Object.keys(value).length === 0) {
        const message = error ? error.message : "missing fields";
        res.status(400).json(message);
        return;
      }
      const floss = await UserCollection.findByIdAndUpdate(
        req.params.flossId,
        req.body,
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