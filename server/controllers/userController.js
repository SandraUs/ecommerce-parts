const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует"),
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("указан неверный пароль"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }

  async me(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "email", "role"],
      });
      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }
      return res.json(user);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async updateEmail(req, res, next) {
    try {
      const { email } = req.body;
      const normalized = String(email ?? "").trim().toLowerCase();
      if (!normalized) {
        return next(ApiError.badRequest("Некорректный email"));
      }

      const exists = await User.findOne({ where: { email: normalized } });
      if (exists && Number(exists.id) !== Number(req.user.id)) {
        return next(ApiError.badRequest("Пользователь с таким email уже существует"));
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }

      await user.update({ email: normalized });
      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return next(ApiError.badRequest("Некорректные данные"));
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }

      const ok = bcrypt.compareSync(String(currentPassword), user.password);
      if (!ok) {
        return next(ApiError.badRequest("Текущий пароль неверный"));
      }

      const hashPassword = await bcrypt.hash(String(newPassword), 5);
      await user.update({ password: hashPassword });

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new UserController();
