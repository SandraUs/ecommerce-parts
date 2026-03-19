import { useEffect, useState } from 'react';
import './styles.css';
import { Loader } from '../../components/loader/Loader';
import { API_BASE, withAuth } from '../../bff/api';
import { useSelector } from '../../store';
import { selectUser } from '../../selectors';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);

  useEffect(() => {
    fetch(`${API_BASE}/orders`, withAuth(user?.token))
      .then(res => res.json())
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, [user?.token]);

  if (loading) {
    return (
      <div className="orders-page">
        <Loader label="Загрузка заказов..." />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Мои заказы</h1>

      {orders.length === 0 ? (
        <p>У вас пока нет заказов</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <strong>Заказ № {order.number}</strong>
                  <div className="order-date">
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </div>
                </div>

                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div className="order-item" key={index}>
                    <span>{item.title}</span>
                    <span>
                      {item.quantity} × {item.price} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span>Итого:</span>
                <strong>{order.total} ₽</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

