import { Suspense } from "react";
import BasicTanstackTable from "@/components/tanstackTable/BasicTanstackTable";



const HomePage = async() => {
  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-semibold text-emerald-700">Dashboard / Members</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Keep your community moving.</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">A quick view of the people helping build a cleaner, more connected future.</p>
      </div>
      <div>
    
      </div>
    </div>
  );
};

export default HomePage;