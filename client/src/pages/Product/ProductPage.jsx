import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles.css';
import { API_BASE, getImageUrl } from '../../bff/api';
import { useAddToCart } from '../../hooks';
import { Loader } from '../../components/loader/Loader';

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addingId, addToCart } = useAddToCart({ source: 'product' });

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleAddToCart = async () => {
    setError(null);
    try {
      await addToCart(product);
    } catch {
      setError('Не удалось добавить в корзину, попробуйте ещё раз.');
    }
  };

  if (!product) return <Loader label="Загрузка товара..." />;
  const adding = addingId === product.id;

  return (
    <div className="product-page">
      <div className="product-card-detail">
        <div className="product-image">
          <img src={getImageUrl(product.image)} alt={product.title} />
        </div>

        <div className="product-info-detail">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-meta-detail">
            <span className="sku">Артикул: {product.article}</span>
            <span
              className={`stock ${
                product.availability ? 'in-stock' : 'out-stock'
              }`}
            >
              {product.availability ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>

          <div className="product-price">{product.price} ₽</div>

          <button
            type="button"
            className="add-to-cart"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Добавляем...' : 'Добавить в корзину'}
          </button>

          {error && <p className="product-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

