const { UserCollection, addWishListValidate, changheWishListFlossValidate } = require("../models/userCollection");


const getAll = async (req, res, next) => {
  try {
    const collection = await UserCollection.findById(req.headers.collectionid);

    res.status(200).json(collection.wishList);
  } catch (e) {
    res.status(204).json({ message: "No wishes" });
    next(e);
  }
};

const addOne = async (req, res, next) => {
  const floss = req.body;
  const { error } = addWishListValidate.validate(floss);
  if (error) {
    // console.log(error);
    // console.log(error.details[0].message);
    throw new Error(`${error.details[0].message}`);
  }
  
  try {
    const collection = await UserCollection.findById(req.headers.collectionid);
    if (
      collection.wishList.find(
        (item) =>
          item.number.toLowerCase() === floss.number.toLowerCase() &&
          item.label.toLowerCase() === floss.label.toLowerCase()
      )
    ) {
      throw new Error(
        "You already have this floss. Please find it in your wish list and update count"
      )
    }
    const newWishList = [...collection.wishList, floss];
    // console.log(newWishList);
    // console.log(floss, req.headers.collectionid);
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });

    res.status(200).json(collection.wishList);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({message: e.message});
    // next(e);
  }
};


const addFromSchema = async (req, res, next) => {
  const flossList = req.body;
  // console.log(flossList);
  try {
    const collection = await UserCollection.findById(req.headers.collectionid);
    // console.log(collection);

const apdatedFlosses = flossList.map(item=>{ const floss = collection.wishList.find(floss => item.number.toLowerCase() === floss.number.toLowerCase() &&
  item.label.toLowerCase() === floss.label.toLowerCase())
  if (floss){
    // console.log("1", {number: floss.number, label: floss.label, _id: floss._id, count: Number(item.count)+ Number(floss.count)})
return {number: item.number, label: item.label, _id: floss._id, count: (Number(item.count)+ Number(floss.count))}
  } 
  //  console.log("2",{number: item.number, label: item.label, count:item.count}); 
   return {number: item.number, label: item.label, count:item.count}}

) 
  console.log("3", ...apdatedFlosses);
 const filteredWishList = collection.wishList.filter(item => item.number !== apdatedFlosses.find(floss => item.number.toLowerCase() === floss.number.toLowerCase() &&
 item.label.toLowerCase() === floss.label.toLowerCase())?.number)

    const newWishList = [...filteredWishList, ...apdatedFlosses];
    console.log("4", newWishList);
    // console.log(flossList, req.headers.collectionid);
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });

    res.status(200).json(collection.wishList);
  } catch (e) {
    res.status(400).json({ message: e.message });
    next(e);
  }
};

const deleteOne = async (req, res, next) => {
  const { flossId } = req.params;

  try {
    const collection = await UserCollection.findById(req.headers.collectionid);
    // console.log(collection.wishList, flossId);
    const newWishList = collection.wishList.filter(
      (floss) => floss._id.toString() !== flossId
    );
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });

    res.status(200).json(flossId);
  } catch (e) {
    res.status(400).json({ message: "No wishes" });
    next(e);
  }
};

const deleteMany = async (req, res, next) => {
  const flossesIds = req.body;
  // console.log(flossesIds);
  try {
    const collection = await UserCollection.findById(req.headers.collectionid);
    const newWishList = [];
    collection.wishList.forEach((floss) =>
      flossesIds.forEach((item) => {
        if (floss._id !== item.id) {
          newWishList.push(floss);
        }
      })
    );
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });

    res.status(200).json(flossesIds);
  } catch (e) {
    res.status(400).json({ message: "No wishes" });
    next(e);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    const collection = await UserCollection.findByIdAndUpdate(
      req.headers.collectionid,
      {
        wishList: [],
      }
    );

    res.status(200).json(collection.wishList);
  } catch (e) {
    res.status(400).json({ message: "No wishes" });
    next(e);
  }
};

const DeleteSchemaNeeded = async (req, res, next) => {
  const flosses = req.body;
  // console.log(flosses);
  try {
    const collection = await UserCollection.findById(req.headers.collectionid);
    const newWishList = [];
    collection.wishList.forEach((floss) =>
      flosses.forEach((item) => {
        if (floss.number !== item.number && floss.label !== item.label) {
          newWishList.push(floss);
        }
      })
    );
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });

    res.status(200).json(flosses);
  } catch (e) {
    res.status(400).json({ message: "No wishes" });
    next(e);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { error } = changheWishListFlossValidate.validate(req.body);
    if (error) {
      // console.log(error.details[0].message);
     throw new Error(`${error.details[0].message}`);
    }
    const { id, count } = req.body;
    const collection = await UserCollection.findById(req.headers.collectionid);
    // console.log(collection.wishList, id, count);
    const newWishList = collection.wishList.map((floss) => {
      if (floss._id.toString() === id) {
        return {
          label: floss.label,
          number: floss.number,
          count: count,
          _id: floss._id,
        };
      }
      return floss;
    });
    await UserCollection.findByIdAndUpdate(req.headers.collectionid, {
      wishList: newWishList,
    });
    // console.log(newWishList);
    res.status(200).json(id);
  } catch (e) {

    res.status(400).json({ message: e.message});
    // next(e);
  }
};

// const AddToFlossList= async (req, res, next) =>{

module.exports = {
  getAll,
  addOne,
  addFromSchema,
  deleteOne,
  deleteMany,
  deleteAll,
  DeleteSchemaNeeded,
  updateOne,
};
