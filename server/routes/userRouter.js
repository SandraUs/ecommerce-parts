const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/me", authMiddleware, userController.me);
router.patch("/email", authMiddleware, userController.updateEmail);
router.patch("/password", authMiddleware, userController.updatePassword);

module.exports = router;
