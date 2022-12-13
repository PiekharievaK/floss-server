const express = require("express");
const ctrl = require("../../controllers");
const {auth} = require("../../middlewares")

const router = express.Router();

router.get("/:collectionId", ctrl.userFloses.getAll);

router.get("/:flossId", ctrl.userFloses.getFlossById);

router.post("/", auth, ctrl.userFloses.addNewFloss);

router.put("/:collectionId", ctrl.userFloses.updateFloss);

router.delete("/:flossId", ctrl.userFloses.deleteFloss);

router.patch("/:flossId/favorite", ctrl.userFloses.updateStatusFloss);

module.exports = router;
