import './serviceBenefits.css';

const containerServiceBenefits = [
	{
		id: 1,
		text: 'Оригинальные запчасти',
		icon: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
		<path d="M22 19.6l-6.4-6.4a5.5 5.5 0 0 1-7.1-7.1l2.6 2.6 2.8-2.8L11.3 3A5.5 5.5 0 0 1 18 9.7l6.4 6.4-2.4 3.5z" />
		</svg>
	)
	},
	{
		id: 2,
		text: 'Бесплатная доставка от 10 000 ₽',
		icon: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M3 7h13l3 4v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V7zm13 0V4H3v3h13z" />
		</svg>
		)
	},
	{
		id: 3,
		text: 'Накопительные скидки',
		icon: (
			<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M3 12l9-9h7a2 2 0 0 1 2 2v7l-9 9L3 12z"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<circle cx="16" cy="8" r="1.5" fill="currentColor" />
			<line x1="9" y1="15" x2="13" y2="11" stroke="currentColor" strokeWidth="2" />
			<circle cx="9" cy="11" r="1.2" fill="currentColor" />
			<circle cx="13" cy="15" r="1.2" fill="currentColor" />
			</svg>
		)
}

];

export const ServiceBenefits = () => {
  return (
    <section className="features">
      {containerServiceBenefits.map(({ id, text, icon }) => (
        <div key={id} className="feature-item">
          <div className="feature-icon">{icon}</div>
          <span className="feature-text">{text}</span>
        </div>
      ))}
    </section>
  );
};
