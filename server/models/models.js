const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketParts = sequelize.define("basket_parts", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

const Parts = sequelize.define("parts", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  oldPrice: { type: DataTypes.INTEGER, allowNull: true },
  article: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  availability: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  img: { type: DataTypes.STRING, allowNull: true },
});

const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const PartsInfo = sequelize.define("parts_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define("define_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  number: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "В обработке" },
  total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const OrderItem = sequelize.define("order_item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketParts);
BasketParts.belongsTo(Basket);

Type.hasMany(Parts);
Parts.belongsTo(Type);

Brand.hasMany(Parts);
Parts.belongsTo(Brand);

Parts.hasMany(Rating);
Rating.belongsTo(Parts);

Parts.hasMany(BasketParts);
BasketParts.belongsTo(Parts);

Parts.hasMany(PartsInfo);
PartsInfo.belongsTo(Parts);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem, { as: "items" });
OrderItem.belongsTo(Order);

module.exports = {
  User,
  Basket,
  BasketParts,
  Parts,
  Type,
  Brand,
  Rating,
  TypeBrand,
  PartsInfo,
  Order,
  OrderItem,
};
