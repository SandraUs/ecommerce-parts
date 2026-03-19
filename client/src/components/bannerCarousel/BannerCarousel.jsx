import { useEffect, useMemo, useState } from "react";
import "./bannerCarousel.css";

export const BannerCarousel = () => {
  const banners = useMemo(
    () => [
      { id: 1, title: "Скидки на популярные позиции", cta: "Посмотреть" },
      { id: 2, title: "Новинки в каталоге", cta: "Открыть" },
      { id: 3, title: "Быстрая доставка по регионам", cta: "Узнать" },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [banners.length]);

  const activeBanner = banners[activeIndex];

  return (
    <div className="banner-carousel">
      <div className="banner-content">
        <h2 className="banner-title">{activeBanner.title}</h2>
        <button className="banner-btn" type="button">
          {activeBanner.cta}
        </button>
      </div>

      <div className="carousel-dots">
        {banners.map((b, idx) => (
          <span
            key={b.id}
            className={`dot ${idx === activeIndex ? "active" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={`Баннер ${idx + 1}`}
            onClick={() => setActiveIndex(idx)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveIndex(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
};