const { Router } = require("express");
const router = Router();
const productsController = require("../controllers/productsController");

router.get("/", productsController.getAll);
router.get("/:id", productsController.getOne);

module.exports = router;

