import './footer.css';
import logo from '../../assets/logo.png'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-contacts">
          <h3 className="footer-title">Наши контакты</h3>

          <div className="contact-item">
            <span className="contact-label">Телефон</span>
            <span className="contact-value">+7 (800) 755 44 50</span>
          </div>

          <div className="contact-item">
            <span className="contact-label">E-Mail</span>
            <span className="contact-value">kras2@akgs.market</span>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <div className="logo">
						<img
						  src={logo}
						  alt="АКГС автоцентр"
						  className="logo-image"
						/>
					  </div>
          </div>

          <div className="copyright">
            2026 © Интернет-магазин АКГС
          </div>
        </div>
      </div>
    </footer>
  );
};
