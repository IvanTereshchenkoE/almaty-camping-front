import { HomeHero } from './home-hero';
import { HomeBenefits } from './home-benefits';
import { HomeLocations } from './home-locations';
import { HomeCta } from './home-cta';

export const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <HomeBenefits />
      <HomeLocations />
      <HomeCta />
    </div>
  );
};
