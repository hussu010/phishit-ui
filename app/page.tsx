import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Adventures from "@/components/Adventures";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Adventures />
    </div>
  );
}
