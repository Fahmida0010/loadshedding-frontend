import Hero from "./components/home/Hero";
import AreaSchedule from "./components/home/AreaSchedule";
import CurrentOutages from "./components/home/CurrentOutages";
import Services from "./components/home/Services";
import FAQ from "./components/home/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <AreaSchedule />
        <Services />
        <CurrentOutages />
        <FAQ />
      </main>
    </div>
  );
}
