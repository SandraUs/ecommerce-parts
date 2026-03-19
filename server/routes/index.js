const { Router } = require("express");
const router = Router();
const partsRouter = require("./partsRouter");
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const categoriesRouter = require("./categoriesRouter");
const productsRouter = require("./productsRouter");
const cartRouter = require("./cartRouter");
const ordersRouter = require("./ordersRouter");
const contentRouter = require("./contentRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", partsRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/", contentRouter);

module.exports = router;
