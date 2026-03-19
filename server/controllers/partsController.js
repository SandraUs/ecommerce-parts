const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { Parts, PartsInfo } = require("../models/models");

class PartsController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files || {};

      if (!name || !price) {
        return next(ApiError.badRequest("Название и цена обязательны"));
      }

      if (!img) {
        return next(ApiError.badRequest("Изображение товара обязательно"));
      }

      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const parts = await Parts.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          PartsInfo.create({
            title: i.title,
            description: i.description,
            partsId: parts.id,
          }),
        );
      }

      return res.json(parts);
    } catch (e) {
      return next(ApiError.badRequest(e.message || "Не удалось создать товар"));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let parts;
    if (!brandId && !typeId) {
      parts = await Parts.findAndCountAll({ limit, offset });
    }

    if (brandId && !typeId) {
      parts = await Parts.findAndCountAll({
        where: { brandId, limit, offset },
      });
    }

    if (!brandId && typeId) {
      parts = await Parts.findAndCountAll({ where: { typeId, limit, offset } });
    }

    if (brandId && typeId) {
      parts = await Parts.findAndCountAll({
        where: { typeId, brandId, limit, offset },
      });
    }

    return res.json(parts);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const parts = await Parts.findOne({
      where: { id },
      include: [{ model: PartsInfo, as: "info" }],
    });
    return res.json(parts);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, brandId, typeId } = req.body;

      const parts = await Parts.findByPk(id);
      if (!parts) {
        return next(ApiError.badRequest("Товар не найден"));
      }

      await parts.update({ name, price, brandId, typeId });
      return res.json(parts);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Parts.destroy({ where: { id } });
      if (!deleted) {
        return next(ApiError.badRequest("Товар не найден"));
      }
      return res.json({ message: "Товар удалён" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new PartsController();
