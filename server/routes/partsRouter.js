const { Router } = require("express");
const router = Router();
const partsController = require("../controllers/partsController");
const fileUpload = require("express-fileupload");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(fileUpload({}));

router.get("/", partsController.getAll);
router.get("/:id", partsController.getOne);

router.post("/", authMiddleware, checkRole("ADMIN"), partsController.create);
router.patch(
  "/:id",
  authMiddleware,
  checkRole("ADMIN"),
  partsController.update,
);
router.delete(
  "/:id",
  authMiddleware,
  checkRole("ADMIN"),
  partsController.delete,
);

module.exports = router;
