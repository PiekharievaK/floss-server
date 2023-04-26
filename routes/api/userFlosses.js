const express = require("express");
const ctrl = require("../../controllers");
const {auth} = require("../../middlewares")

const router = express.Router();

router.get("/:collectionId", auth, ctrl.userFloses.getAll);

router.get("/:flossId", ctrl.userFloses.getFlossById);

router.post("/", auth, ctrl.userFloses.addNewFloss);

router.put("/:collectionId", auth, ctrl.userFloses.updateFloss);

router.delete("/:flossId", auth, ctrl.userFloses.deleteFloss);

router.patch("/:flossId/favorite", auth, ctrl.userFloses.updateStatusFloss);

module.exports = router;
