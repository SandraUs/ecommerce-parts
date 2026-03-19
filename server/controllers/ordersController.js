const ApiError = require("../error/ApiError");
const {
  Order,
  OrderItem,
  Basket,
  BasketParts,
  Parts,
} = require("../models/models");

class OrdersController {
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { userId },
        include: [{ model: OrderItem, as: "items" }],
        order: [["id", "DESC"]],
      });

      return res.json(
        orders.map((o) => {
          const plain = o.toJSON();
          return {
            id: String(plain.id),
            number: plain.number,
            date: plain.date,
            status: plain.status,
            total: plain.total,
            items: (plain.items ?? []).map((it) => ({
              title: it.title,
              price: it.price,
              quantity: it.quantity,
            })),
          };
        }),
      );
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { number, date, status, total, items } = req.body ?? {};

      if (!number || !date || !Array.isArray(items) || items.length === 0) {
        return next(ApiError.badRequest("Некорректные данные заказа"));
      }

      const order = await Order.create({
        userId,
        number: String(number),
        date: new Date(date),
        status: String(status ?? "В обработке"),
        total: Number(total) || 0,
      });

      await Promise.all(
        items.map((it) =>
          OrderItem.create({
            orderId: order.id,
            title: String(it.title ?? ""),
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 1,
          }),
        ),
      );

      const basket = await Basket.findOne({ where: { userId } });
      if (basket) {
        await BasketParts.destroy({ where: { basketId: basket.id } });
      }

      const created = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, as: "items" }],
      });

      return res.json(created);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrdersController();
