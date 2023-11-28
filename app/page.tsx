import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AdventureCard from "@/components/AdventureCard";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <AdventureCard />
    </div>
  );
}
