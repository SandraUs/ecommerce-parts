const { Parts, Brand } = require("../models/models");
const { Op } = require("sequelize");

const toProductDto = (p) => {
  const plain = p?.toJSON ? p.toJSON() : p;
  return {
    id: String(plain.id),
    categoryId: plain.typeId ? String(plain.typeId) : null,
    title: plain.name,
    price: plain.price,
    oldPrice: plain.oldPrice ?? null,
    article: plain.article ?? null,
    brand: plain.brand?.name ?? null,
    city: plain.city ?? null,
    image: plain.img ? `/static/${plain.img}` : null,
    description: plain.description ?? null,
    availability: !!plain.availability,
  };
};

class ProductsController {
  async getAll(req, res, next) {
    try {
      const { categoryId, q } = req.query;
      const where = {};
      if (categoryId) where.typeId = categoryId;

      const rawQ = typeof q === "string" ? q.trim() : "";
      if (rawQ) {
        const pattern = `%${rawQ}%`;
        where[Op.or] = [
          { name: { [Op.iLike]: pattern } },
          { article: { [Op.iLike]: pattern } },
          { "$brand.name$": { [Op.iLike]: pattern } },
        ];
      }

      const parts = await Parts.findAll({
        where,
        include: [{ model: Brand }],
        order: [["id", "ASC"]],
      });

      return res.json(parts.map(toProductDto));
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const part = await Parts.findByPk(id, { include: [{ model: Brand }] });
      if (!part) return res.status(404).json({ message: "Товар не найден" });
      return res.json(toProductDto(part));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductsController();

