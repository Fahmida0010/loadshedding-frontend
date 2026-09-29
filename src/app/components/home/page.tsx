import AreaSchedule from "./AreaSchedule";
import CurrentOutages from "./CurrentOutages";
import FAQ from "./FAQ";
import Hero from "./Hero";
import Services from "./Services";


export default function HomePage() {
  return (
    <>
      <Hero />
      <AreaSchedule/>
      <CurrentOutages />
      <Services/>
      <FAQ/>
    </>
  );
}