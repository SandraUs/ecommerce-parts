import './styles.css';

export const Pay = () => {
  return (
    <div className="pay-page">
      <div className="pay-container">
        <h2 className="pay-title">
          Оплата товаров в Интернет-магазине автозапчастей ГК Автоцентр КГС
        </h2>

        <p className="pay-text">
          Мы работаем по предоплате. Оплатить заказ Вы можете на сайте
          <strong> www.akgs.market</strong> в личном кабинете или в магазине,
          выбранном при регистрации.
        </p>

        <h3 className="pay-subtitle">Доступные способы оплаты</h3>
        <ul className="pay-list">
          <li>Наличный расчет</li>
          <li>Банковская карта в магазине</li>
          <li>
            Онлайн-оплата на сайте www.akgs.market
            <span className="pay-muted"> (Интернет-эквайринг Сбербанк)</span>
          </li>
        </ul>

        <h3 className="pay-subtitle">Поддерживаемые платёжные системы</h3>
        <ul className="pay-list pay-cards">
          <li>МИР</li>
          <li>VISA International</li>
          <li>Mastercard Worldwide</li>
          <li>Maestro</li>
        </ul>

        <div className="pay-info">
          <p>
            При онлайн-оплате осуществляется переход на платёжный шлюз ПАО
            СБЕРБАНК. Передача информации происходит в защищенном режиме по
            протоколу SSL.
          </p>

          <p>
            Если Ваш банк поддерживает технологии Verified By Visa или
            MasterCard SecureCode, может потребоваться ввод дополнительного
            пароля.
          </p>

          <p className="pay-warning">
            Обращаем внимание: действие дисконтных карт ГК Автоцентр КГС не
            распространяется на заказы интернет-магазина.
          </p>
        </div>
      </div>
    </div>
  );
};

