const FormData = require("form-data");
const axios = require("axios");
const { IMGBB_KEY } = process.env;
const {
  UserCollection,
  addSchemaValidate,
} = require("../models/userCollection");
// const { number } = require("joi");

// const { DMCFlosses } = require("../models/floss");

const checkFlossAvailability = (userSchemaCollection, userFlossCollection) => {
  const checkedSchemas = userSchemaCollection.map((schema) => {
    if (schema.flossesList < 1) {
      return schema;
    }
    const updatedFlossesList = schema.flossesList.map((labeledFlosses) => {
      const availabeFlosses = labeledFlosses.flosses.map((floss) => {
        const userFloss = userFlossCollection.find(
          (item) =>
            labeledFlosses.label.toLowerCase() === item.label.toLowerCase() &&
            floss.number === item.number
        );
        if (!userFloss) {
          return {
            _id: floss._id,
            number: floss.number,
            count: floss.count,
            availabel: false,
            missingQuantity: floss.count,
          };
        }
        const checkedFloss = {
          _id: floss._id,
          number: floss.number,
          count: floss.count,
          availabel: Number(floss.count) <= Number(userFloss.count),
          missingQuantity: Math.abs(
            Number(floss.count) - Number(userFloss.count)
          ),
        };
        return checkedFloss;
      });
      return {
        _id: labeledFlosses._id,
        label: labeledFlosses.label,
        flosses: availabeFlosses,
      };
    });

    return {
      _id: schema._id,
      name: schema.name,
      image: schema.image,
      flossesList: updatedFlossesList,
    };
  });
  return checkedSchemas;
};

const getAll = async (req, res, next) => {
  const collectionId = req.params.collectionId;

  try {
    const collection = await UserCollection.findById(collectionId);
    const checkedSchemas = checkFlossAvailability(
      collection.schemaCollection,
      collection.flossCollection
    );
    res.status(200).json(checkedSchemas);
  } catch (e) {
    console.log(e.message);
    res.status(204).json({ message: "No schemas" });
    next(e);
  }
};

const addImage = async (req, res, next) => {
  const { collectionid, schemaid } = req.headers;
  const image = req.body;
  try {
    const imgbbUrl = `https://api.imgbb.com/1/upload/schemas?key=${IMGBB_KEY}`;

    const formData = new FormData();
    formData.append("image", image.image.split(",").pop());
    formData.append("name", image.name);

    const { data } = await axios.post(imgbbUrl, formData);
    // console.log(data);

    try {
      const collection = await UserCollection.findById(collectionid);
      const newCollection = collection.schemaCollection.map((schema) => {
        if (schema._id.toString() !== schemaid) {
          return schema;
        }

        schema.image = {
          urlPreview: data.data.medium?.url
            ? data.data.medium.url
            : data.data.display_url,
          urlFull: data.data.image.url,
          deleteUrl: data.data.delete_url,
        };
        return schema;
      });
      await UserCollection.findByIdAndUpdate(collectionid, {
        schemaCollection: newCollection,
      });

      res.status(200).json(collection.schemaCollection[schemaid]);
    } catch (e) {
      console.log(e.message);
      res.status(204).json({ message: "No schemas" });
      next(e);
    }
  } catch (error) {
    console.log(error);
  }
};

const addFloss = async (req, res, next) => {
  const { collectionid, schemaid } = req.headers;
  const addedFloss = req.body;
  try {
    const collection = await UserCollection.findById(collectionid);
    if (
      collection.wishList.find(
        (item) =>
          item.number.toLowerCase() === addedFloss.number.toLowerCase() &&
          item.label.toLowerCase() === addedFloss.label.toLowerCase()
      )
    ) {
      throw new Error(
        "You already have this floss in your schema"
      )
    }
    const newCollection = collection.schemaCollection.map((schema) => {
      if (schema._id.toString() !== schemaid) {
        return schema;
      }
      if (schema.flossesList.length < 1) {
        schema.flossesList.push({
          label: addedFloss.label,
          flosses: [{ number: addedFloss.number, count: addedFloss.count }],
        });
      } else {
        const flossLabel = schema.flossesList.find(
          (flosses) => flosses.label === addedFloss.label
        );
        if (flossLabel) {
          flossLabel.flosses.push({
            number: addedFloss.number,
            count: addedFloss.count,
          });
        } else {
          schema.flossesList.push({
            label: addedFloss.label,
            flosses: [{ number: addedFloss.number, count: addedFloss.count }],
          });
        }
      }
      return schema;
    });

    await UserCollection.findByIdAndUpdate(collectionid, {
      schemaCollection: newCollection,
    });

    res.status(200).json(collection.schemaCollection[schemaid]);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    next(e);
  }
};

const deleteFloss = async (req, res, next) => {
  const { collectionid, schemaid } = req.headers;

  const { label, flossId } = req.body;
  // console.log(collectionid, schemaid, label, flossId);
  try {
    const collection = await UserCollection.findById(collectionid);
    const newCollection = await collection.schemaCollection.map((schema) => {
      if (schema._id.toString() !== schemaid) {
        return schema;
      }
      const newSchema = schema;
      const flossLabel = newSchema.flossesList.find(
        (flosses) => flosses.label === label
      );
      // console.log(flossLabel.flosses, flossId);
      if (flossLabel) {
        flossLabel.flosses = flossLabel.flosses.filter(
          (floss) => floss._id.toString() !== flossId
        );
        if (flossLabel.flosses.length < 1) {
          newSchema.flossesList = newSchema.flossesList.filter(
            (flosses) => flosses.label !== label
          );
          return newSchema;
        }
        return schema;
      } else {
        throw new Error("no floss by this lable");
      }
    });
    await UserCollection.findByIdAndUpdate(collectionid, {
      schemaCollection: newCollection,
    });
    res.status(200).json(collection.schemaCollection);
  } catch (e) {
    console.log(e);
    res.status(204).json({ message: e.message });
    next(e);
  }
};

const addNewSchema = async (req, res, next) => {
  const { collectionId, schema } = req.body;
  const userCollection = await UserCollection.findById(collectionId);
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
      if (
        userCollection.schemaCollection.find(
          (item) => item.name.toLowerCase() === schema.name.toLowerCase()
        )
      ) {
        throw new Error(`You already have schema with this name`);
      }
      const collection = await UserCollection.findByIdAndUpdate(collectionId, {
        schemaCollection: [...userCollection.schemaCollection, newSchema],
      });

      res.status(201).json(collection.schemaCollection);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    next(e);
  }
};

const deleteSchema = async (req, res, next) => {
  const { collectionid, schemaid } = req.headers;
  // console.log(collectionid, schemaid);
  try {
    const collection = await UserCollection.findByIdAndUpdate(collectionid);
    // console.log(collection);
    const newCollection = await collection.schemaCollection.filter(
      (schema) => schema._id.toString() !== schemaid
    );
    // console.log(newCollection.schemaCollection);
    await UserCollection.findByIdAndUpdate(collectionid, {
      schemaCollection: newCollection,
    });
    res.status(200).json("Sucsesfully delete");
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
    next(e);
  }
};

module.exports = {
  getAll,
  addNewSchema,
  addImage,
  addFloss,
  deleteFloss,
  deleteSchema,
};
