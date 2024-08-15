const express = require("express");
const ctrl = require("../../controllers");
const {auth} = require("../../middlewares")

const router = express.Router();

router.get("/", auth, ctrl.userProfile.getProfileData);

router.put("/check", auth, ctrl.userProfile.checkPassword)

router.post("/changePassword", ctrl.userProfile.changePassword);

router.post("/temporaryPassword/:email", ctrl.userProfile.resetPassword);

// router.post("/changeUserName", ctrl.userFloses.getFlossById);

// router.post("/image", auth, ctrl.userFloses.addNewFloss);

// router.delete("/:userId", auth, ctrl.userProfile.deleteUser);

// router.put("/:collectionId", auth, ctrl.userFloses.updateFloss);

// router.patch("/:flossId/favorite", auth, ctrl.userFloses.updateStatusFloss);

module.exports = router;
