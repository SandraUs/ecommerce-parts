import { useEffect, useState } from 'react';
import './styles.css';
import { API_BASE } from '../../bff/api';

export const Vacancies = () => {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/vacancies`)
      .then(res => res.json())
      .then(data => setVacancies(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="vacancies-page">
      <h1>Вакансии</h1>

      <div className="vacancies-list">
        {vacancies.map(vacancy => (
          <div key={vacancy.id} className="vacancy-card">
            <h2>
              {vacancy.title} <span>({vacancy.city})</span>
            </h2>

            <div className="vacancy-block">
              <strong>Обязанности:</strong>
              <p>{vacancy.responsibilities}</p>
            </div>

            <div className="vacancy-block">
              <strong>Требования:</strong>
              <p>{vacancy.requirements}</p>
            </div>

            <div className="vacancy-block">
              <strong>Условия:</strong>
              <p>{vacancy.conditions}</p>
            </div>

            <div className="vacancy-block">
              <strong>Место работы:</strong>
              <p>{vacancy.location}</p>
            </div>

            <div className="vacancy-block">
              <strong>Контакты:</strong>
              <p>{vacancy.contacts.name}</p>
              <p>{vacancy.contacts.phone}</p>
              {vacancy.contacts.email.map(mail => (
                <p key={mail}>{mail}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

