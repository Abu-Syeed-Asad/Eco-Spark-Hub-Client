import { Suspense } from "react";
import BasicTanstackTable from "@/components/tanstackTable/BasicTanstackTable";
import HeroSection from "@/components/module/home/HeroSection";
import Post from "@/components/module/home/Post";



const HomePage = async() => {
  return (
    <div >
      <div >
        <HeroSection />
        <Post/>
      </div>
    </div>
  );
};

export default HomePage;