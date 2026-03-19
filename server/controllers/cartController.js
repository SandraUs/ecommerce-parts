const ApiError = require("../error/ApiError");
const { Basket, BasketParts, Parts } = require("../models/models");

const toCartDto = (bp) => {
  const plain = bp?.toJSON ? bp.toJSON() : bp;
  const part = plain.part;
  return {
    id: String(part.id),
    title: part.name,
    article: part.article ?? "",
    price: part.price,
    quantity: plain.quantity ?? 1,
  };
};

class CartController {
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        const created = await Basket.create({ userId });
        return res.json([]);
      }

      const rows = await BasketParts.findAll({
        where: { basketId: basket.id },
        include: [{ model: Parts }],
        order: [["id", "ASC"]],
      });
      return res.json(rows.map(toCartDto));
    } catch (e) {
      next(e);
    }
  }

  async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { id, quantity } = req.body;
      const partsId = Number(id);
      if (!partsId) return next(ApiError.badRequest("Некорректный id товара"));

      const parts = await Parts.findByPk(partsId);
      if (!parts) return next(ApiError.badRequest("Товар не найден"));

      const basket =
        (await Basket.findOne({ where: { userId } })) ??
        (await Basket.create({ userId }));

      const existing = await BasketParts.findOne({
        where: { basketId: basket.id, partId: partsId },
      });

      if (existing) {
        const nextQty = (existing.quantity ?? 1) + (Number(quantity) || 1);
        await existing.update({ quantity: nextQty });
        const withParts = await BasketParts.findByPk(existing.id, {
          include: [{ model: Parts }],
        });
        return res.json(toCartDto(withParts));
      }

      const created = await BasketParts.create({
        basketId: basket.id,
        partId: partsId,
        quantity: Number(quantity) || 1,
      });
      const withParts = await BasketParts.findByPk(created.id, {
        include: [{ model: Parts }],
      });
      return res.json(toCartDto(withParts));
    } catch (e) {
      next(e);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const userId = req.user.id;
      const partsId = Number(req.params.id);
      const { quantity } = req.body;
      const nextQty = Number(quantity);
      if (!partsId || !Number.isFinite(nextQty)) {
        return next(ApiError.badRequest("Некорректные данные"));
      }

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) return next(ApiError.badRequest("Корзина не найдена"));

      const row = await BasketParts.findOne({
        where: { basketId: basket.id, partId: partsId },
      });
      if (!row) return next(ApiError.badRequest("Товар не найден в корзине"));

      if (nextQty <= 0) {
        await row.destroy();
        return res.json({ message: "Удалено" });
      }

      await row.update({ quantity: nextQty });
      const withParts = await BasketParts.findByPk(row.id, {
        include: [{ model: Parts }],
      });
      return res.json(toCartDto(withParts));
    } catch (e) {
      next(e);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const partsId = Number(req.params.id);
      if (!partsId) return next(ApiError.badRequest("Некорректный id товара"));

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) return res.json({ message: "OK" });

      await BasketParts.destroy({
        where: { basketId: basket.id, partId: partsId },
      });
      return res.json({ message: "OK" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CartController();
