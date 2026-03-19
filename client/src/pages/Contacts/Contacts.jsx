import { useEffect, useState } from 'react';
import './styles.css';
import { API_BASE } from '../../bff/api';

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/contacts`)
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="contacts-page">
      <h2 className="contacts-title">Информация корпоративным клиентам</h2>

      <div className="contacts-grid">
        {contacts.map(item => (
          <div className="contacts-card" key={item.id}>
            <h3 className="contacts-card-title">{item.title}</h3>
            <p className="contacts-card-text">
              <span className="contacts-label">Тел.:</span> {item.phone}
            </p>
            <p className="contacts-card-text">
              <span className="contacts-label">E-mail:</span> {item.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

