import { Link } from "react-router-dom";
import { getImageUrl } from "../../bff/api";

export const ProductCard = ({ product, onAddToCart, isAdding }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <img src={getImageUrl(product.image)} alt={product.title} />

        <div className="product-info">
          <h3>{product.title}</h3>

          <div className="product-meta">
            <span className="product-sku">Арт: {product.article}</span>

            <span
              className={`product-stock ${
                product.availability ? "in-stock" : "out-stock"
              }`}
            >
              {product.availability ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <span className="price">{product.price} ₽</span>
        </div>
      </Link>

      <button
        type="button"
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product)}
        disabled={isAdding || !product.availability}
      >
        {isAdding ? "Добавляем..." : "В корзину"}
      </button>
    </div>
  );
};

