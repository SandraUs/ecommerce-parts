const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addToCart);
router.patch("/:id", authMiddleware, cartController.updateQuantity);
router.delete("/:id", authMiddleware, cartController.removeFromCart);

module.exports = router;

