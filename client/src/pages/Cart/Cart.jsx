import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { Loader } from '../../components/loader/Loader';
import { API_BASE, withAuth } from '../../bff/api';
import { useSelector } from '../../store';
import { selectUser } from '../../selectors';
import {
  clearGuestCart,
  getGuestCart,
  removeFromGuestCart,
  setGuestCartQuantity,
} from '../../cart/guestCart';

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user?.token) {
      setCartItems(getGuestCart());
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/cart`, withAuth(user.token))
      .then(res => res.json())
      .then(data => setCartItems(data))
      .finally(() => setLoading(false));
  }, [user?.token]);

  const handleRemoveItem = id => {
    if (processing) return;

    setCartItems(prevItems => prevItems.filter(item => item.id !== id));

    if (!user?.token) {
      removeFromGuestCart(id);
      window.dispatchEvent(new Event('cart-updated'));
      return;
    }

    fetch(
      `${API_BASE}/cart/${id}`,
      withAuth(user?.token, {
        method: 'DELETE',
      })
    )
      .then(() => {
        window.dispatchEvent(new Event('cart-updated'));
      })
      .catch(error => {
        console.error('Ошибка удаления товара из корзины', error);
      });
  };

  const handleChangeQuantity = (id, delta) => {
    if (processing) return;

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) return item;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
          handleRemoveItem(id);
          return item;
        }

        const updatedItem = { ...item, quantity: newQuantity };

        if (!user?.token) {
          setGuestCartQuantity(id, newQuantity);
          window.dispatchEvent(new Event('cart-updated'));
          return updatedItem;
        }

        fetch(
          `${API_BASE}/cart/${id}`,
          withAuth(user?.token, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity }),
          })
        )
          .then(() => {
            window.dispatchEvent(new Event('cart-updated'));
          })
          .catch(error => {
            console.error('Ошибка обновления количества', error);
          });

        return updatedItem;
      })
    );
  };

  const handleClearCart = () => {
    if (processing || cartItems.length === 0) return;

    setProcessing(true);

    if (!user?.token) {
      clearGuestCart();
      setCartItems([]);
      window.dispatchEvent(new Event('cart-updated'));
      setProcessing(false);
      return;
    }

    const ids = cartItems.map(item => item.id);

    Promise.all(
      ids.map(id =>
        fetch(
          `${API_BASE}/cart/${id}`,
          withAuth(user?.token, {
            method: 'DELETE',
          })
        )
      )
    )
      .then(() => {
        setCartItems([]);
        window.dispatchEvent(new Event('cart-updated'));
      })
      .catch(error => {
        console.error('Ошибка очистки корзины', error);
      })
      .finally(() => setProcessing(false));
  };

  const handleCheckout = async () => {
    if (processing || cartItems.length === 0) return;

    if (!user?.token) {
      navigate('/login');
      return;
    }

    setProcessing(true);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      number: `AKGS-${String(Date.now()).slice(-4)}`,
      date: new Date().toISOString(),
      status: 'В обработке',
      total,
      items: cartItems.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch(
        `${API_BASE}/orders`,
        withAuth(user?.token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderPayload),
        })
      );

      if (!res.ok) {
        throw new Error('Не удалось создать заказ');
      }

      setCartItems([]);
      window.dispatchEvent(new Event('cart-updated'));

      navigate('/orders');
    } catch (error) {
      console.error('Ошибка оформления заказа', error);
    } finally {
      setProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <Loader label="Загрузка корзины..." />;
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Корзина</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Ваша корзина пуста</p>
          <Link to="/" className="cart-back">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h3>{item.title}</h3>
                  <span className="cart-article">Артикул: {item.article}</span>
                </div>

                <div className="cart-item-qty">
                  <button
                    type="button"
                    onClick={() => handleChangeQuantity(item.id, -1)}
                    disabled={processing}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleChangeQuantity(item.id, 1)}
                    disabled={processing}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-price">{item.price * item.quantity} ₽</div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={processing}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Итого</h3>

            <div className="cart-summary-row">
              <span>Сумма</span>
              <span>{total} ₽</span>
            </div>

            <button
              type="button"
              className="cart-clear"
              onClick={handleClearCart}
              disabled={processing || cartItems.length === 0}
            >
              Очистить корзину
            </button>

            <button
              type="button"
              className="cart-checkout"
              onClick={handleCheckout}
              disabled={processing || cartItems.length === 0}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

