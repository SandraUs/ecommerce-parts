const { Router } = require("express");
const router = Router();
const contentController = require("../controllers/contentController");

router.get("/news", contentController.news);
router.get("/stores", contentController.stores);
router.get("/contacts", contentController.contacts);
router.get("/vacancies", contentController.vacancies);

module.exports = router;

