import { BannerCarousel } from '../components/bannerCarousel/BannerCarousel';
import { ServiceBenefits } from '../components/serviceBenefits/ServiceBenefits';
import { CatalogCategories } from '../components/catalogCategories/CatalogCategories';
import { News } from '../components/news/News';

export const HomeRoute = () => {
  return (
    <>
      <BannerCarousel />
      <ServiceBenefits />
      <CatalogCategories />
      <News />
    </>
  );
};

