import { useEffect, useState } from 'react';
import './styles.css';
import { API_BASE } from '../../bff/api';

export const Stores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/stores`)
      .then(res => res.json())
      .then(data => setStores(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="stores-page">
      <h2 className="stores-title">Адреса магазинов</h2>

      <div className="stores-grid">
        {stores.map(store => (
          <div className="store-card" key={store.id}>
            <h3 className="store-city">{store.city}</h3>
            <p className="store-address">{store.address}</p>
            <p className="store-phone">{store.phone}</p>
            <p className="store-email">{store.email}</p>
            <p className="store-work">{store.work}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

