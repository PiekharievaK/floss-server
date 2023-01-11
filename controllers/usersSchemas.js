const FormData = require("form-data");
const axios = require("axios");
const { IMGBB_KEY } = process.env;
const {
  UserCollection,
  addSchemaValidate,
  // addSchemaFlossesValidate,
  // addSchemaImageValidate,
} = require("../models/userCollection");
// const { DMCFlosses } = require("../models/floss");

const getAll = async (req, res, next) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await UserCollection.findById(collectionId);
    res.status(200).json(collection.schemaCollection);
  } catch (e) {
    res.status(204).json({ message: "No schemas" });
    next(e);
  }
};

const addImage = async (req, res, next) => {
  // const { image } = req.body;
  const { collectionid, schemaid } = req.headers;
  const image = req.body;
  try {
    const imgbbUrl = `https://api.imgbb.com/1/upload/schemas?key=${IMGBB_KEY}`;

    const formData = new FormData();
    formData.append("image", image.image.split(",").pop());
    formData.append("name", image.name);

    const { data } = await axios.post(imgbbUrl, formData);
    console.log(data);
 
    try {
      const collection = await UserCollection.findById(collectionid);
      const newCollection = collection.schemaCollection.map((schema) => {
        if (schema._id.toString() !== schemaid) {
          return schema;
        }

        schema.image = {
          urlPreview: data.data.medium?.url? data.data.medium.url: data.data.display_url,
          urlFull: data.data.image.url,
          deleteUrl: data.data.delete_url,
        };
        return schema;
      });
      await UserCollection.findByIdAndUpdate(collectionid, {
        schemaCollection: newCollection,
      });

      res.status(200).json(collection.schemaCollection);
    } catch (e) {
      res.status(204).json({ message: "No schemas" });
      next(e);
    }
  } catch (error) {
    console.log(error);
  }
};

// const getSchemaById = async (req, res, next) => {
//   const flosses = await UserCollection.findById(req.params.flossId);
//   try {
//     if (!flosses) {
//       throw new Error();
//     }
//     if (req.body.floss.label === "DMC") {
//       const dmc = await DMCFlosses.find({ number: req.body.floss.number });
//       console.log(dmc);
//     }
//     res.status(200).json(flosses);
//   } catch (e) {
//     res.status(404).json({ message: "Not found" });
//     next(e);
//   }
// };

const addNewSchema = async (req, res, next) => {
  const { collectionId, schema } = req.body;
  const userCollection = await UserCollection.findById(collectionId);
  console.log(userCollection);
  if (!userCollection) {
    throw new Error("no collection");
  }
  const newSchema = {
    name: schema.name,
    image: {},
    flossesList: [],
  };

  try {
    const { error } = addSchemaValidate.validate(req.body);
    if (error) {
      throw new Error(`${error.details[0].message}`);
    }

    if (userCollection.schemaCollection.length < 1) {
      await UserCollection.findByIdAndUpdate(collectionId, {
        schemaCollection: [newSchema],
      });
      res.status(201).json(userCollection.schemaCollection);
    } else {
      console.log(schema, "else");
      if (
        userCollection.schemaCollection.find(
          (item) => item.name.toLowerCase() === schema.name.toLowerCase()
        )
      ) {
        throw new Error(`You already have schema with this name`);
      }
      console.log("final");
      const collection = await UserCollection.findByIdAndUpdate(collectionId, {
        schemaCollection: [...userCollection.schemaCollection, newSchema],
      });

      res.status(201).json(collection);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    next(e);
  }
};

// const deleteSchema = async (req, res, next) => {
//   try {
//     const floss = await UserCollection.findByIdAndUpdate(req.params.flossId);
//     if (!floss) {
//       throw new Error();
//     }
//     res.status(200).json({ message: "floss deleted" });
//   } catch {
//     res.status(404).json({ message: "Not found" });
//     next();
//   }
// };

// const updateSchema = async (req, res, next) => {
//   const { flossId, method } = req.body;
//   const userCollection = await UserCollection.findById(req.params.collectionId);

//   try {
//     if (method === "delete") {
//       console.log("delete");
//       const newCollection = userCollection.flossCollection.filter(
//         (item) => item._id.toString() !== flossId
//       );
//       const floss = await UserCollection.findByIdAndUpdate(
//         req.params.collectionId,
//         { flossCollection: newCollection }
//       );
//       res.status(200).json(`floss ${floss} delete`);
//     } else {
//       const { error } = updateValidate.validate(req.body);
//       if (error) {
//         throw new Error(`${error.details[0].message}`);
//       }

//       const newCollection = userCollection.flossCollection.map((item) => {
//         if (item._id.toString() === flossId) {
//           item.count = req.body.count;
//           return item;
//         }
//         return item;
//       });
//       const floss = await UserCollection.findByIdAndUpdate(
//         req.params.collectionId,
//         { flossCollection: newCollection }
//       );

//       res.json(floss);
//     }
//   } catch (e) {
//     res.status(404).json({ message: e.message });
//     next(e);
//   }
// };

// const updateStatusFloss = async (req, res, next) => {
//   const { error } = updateFavorite.validate(req.body);
//   try {
//     if (error) {
//       const message = error ? error.message : "missing field";
//       res.status(400).json(message);
//       return;
//     }
//     const floss = await UserCollection.findByIdAndUpdate(
//       req.params.flossId,
//       { favorite: req.body.favorite },
//       { new: true }
//     );
//     if (floss === null) {
//       throw new Error("Not found");
//     }
//     res.json(floss);
//   } catch (e) {
//     res.status(404).json({ message: e.message });
//     next(e);
//   }
// };

module.exports = {
  getAll,
  addNewSchema,
  addImage,
};
