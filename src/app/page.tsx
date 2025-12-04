import grid from "@/assets/grid-pattern.webp";
import Features from "@/sections/features";
import Hero from "@/sections/hero";
import Navbar from "@/sections/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" relative w-full select-none">
      <div className=" w-full absolute inset-x-0 h-screen top-4 z-[-1]">

        <Image fill src={grid} alt="Grid pattern" className=" object-cover object-top" />
      </div>
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}
