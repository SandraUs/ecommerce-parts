const { Type } = require("../models/models");

class CategoriesController {
  async getAll(req, res, next) {
    try {
      const types = await Type.findAll({ order: [["id", "ASC"]] });
      return res.json(
        types.map((t) => ({
          id: String(t.id),
          title: t.name,
          row: 1,
        })),
      );
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoriesController();
