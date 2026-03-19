import './styles.css';

export const Delivery = () => {
  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <h2 className="delivery-title">
          Условия доставки заказа Интернет-магазина WWW.AKGS.MARKET
        </h2>

        <p className="delivery-text">Уважаемые покупатели!</p>

        <p className="delivery-text">
          Отправка товара в регионы осуществляется только с нашего центрального
          склада по адресу:
          <strong> г. Красноярск, ул. Мечникова, д. 50 </strong>
          (обратите внимание на выбранную торговую точку при регистрации и
          оформлении заказа).
        </p>

        <h3 className="delivery-subtitle">Транспортные компании</h3>
        <p className="delivery-text">
          Работаем с транспортными компаниями:{' '}
          <strong>
            СДЭК, Энергия, Деловые Линии, Ночной экспресс, ПЭК.
          </strong>
          Для отправки другими транспортными компаниями требуется предварительное
          согласование с менеджером. Доставка транспортной компанией оплачивается
          получателем!
        </p>

        <h3 className="delivery-subtitle">Самовывоз</h3>
        <p className="delivery-text">
          Самовывоз осуществляется из наших магазинов, которые присутствуют в
          населенных пунктах:
        </p>

        <ul className="delivery-list">
          <li>г. Красноярск</li>
          <li>пгт. Емельяново</li>
          <li>п. Берёзовка</li>
          <li>г. Ачинск</li>
          <li>г. Абакан</li>
          <li>с. Богучаны</li>
          <li>г. Канск</li>
          <li>г. Лесосибирск</li>
          <li>г. Минусинск</li>
          <li>п. Таёжный (Богучанский р-он)</li>
          <li>г. Ужур</li>
        </ul>

        <div className="delivery-note">
          <p>Обращаем Ваше внимание:</p>
          <p className="delivery-note-text">
            Сроки доставки заказных позиций до выбранной торговой точки на сайте
            указаны в рабочих днях.
          </p>
        </div>
      </div>
    </div>
  );
};

