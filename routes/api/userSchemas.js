const express = require("express");
const ctrl = require("../../controllers");
const {auth} = require("../../middlewares")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get("/:collectionId", ctrl.userSchemas.getAll);

// router.get("/:flossId", ctrl.userSchemas.getFlossById);

router.post("/", auth, ctrl.userSchemas.addNewSchema);
router.post("/image", upload.single("image"), ctrl.userSchemas.addImage);
router.post("/floss",  ctrl.userSchemas.addFloss);
router.put("/deleteFloss",  ctrl.userSchemas.deleteFloss);
router.delete("/",  ctrl.userSchemas.deleteSchema)

// router.put("/:collectionId", ctrl.userSchemas.updateFloss);

// router.delete("/:flossId", ctrl.userSchemas.deleteFloss);

// router.patch("/:flossId/favorite", ctrl.userSchemas.updateStatusFloss);

module.exports = router;
