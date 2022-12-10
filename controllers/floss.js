const {
    Floss,
    // addValidate,
    // updateValidate,
    // updateFavorite,
  } = require("../models/floss");


  const getFlossCollection = async (req, res, next) => {
  try {
      const collection = await Floss.find({});
      
      res.status(200).json(collection);
    } catch (e) {
      res.status(204).json({ message: "No contacts" });
      next(e);
    }
  };

// const getAll = async (req, res, next) => {
//     const {_id} = req.user
//     try {
//       const contacts = await Floss.find({owner: _id}).populate("owner", "_id, email" );
//       res.status(200).json(contacts);
//     } catch (e) {
//       res.status(204).json({ message: "No contacts" });
//       next(e);
//     }
//   };

  module.exports = {
    getFlossCollection,
    // getContactById,
    // addNewContact,
    // deleteContact,
    // updateContact,
    // updateStatusContact,
  };