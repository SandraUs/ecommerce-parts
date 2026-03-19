const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/authMiddleware");
const ordersController = require("../controllers/ordersController");

router.get("/", authMiddleware, ordersController.getAll);
router.post("/", authMiddleware, ordersController.create);

module.exports = router;

