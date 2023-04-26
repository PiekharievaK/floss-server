const express = require("express");
const ctrl = require("../../controllers");
const { auth } = require("../../middlewares");

const router = express.Router();

router.get("/", auth, ctrl.userWishList.getAll);
router.post("/", auth, ctrl.userWishList.addOne);
router.post("/schema", auth, ctrl.userWishList.addFromSchema);
router.delete("/", auth, ctrl.userWishList.deleteAll);
router.delete("/:flossId", auth, ctrl.userWishList.deleteOne);
router.patch("/", auth, ctrl.userWishList.updateOne);

// router.patch("/schema/delete", ctrl.userWishList.updateStatusFloss);

module.exports = router;
